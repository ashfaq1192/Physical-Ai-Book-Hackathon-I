---
title: "ROS 2 Actions: Managing Long-Running Tasks"
sidebar_position: 6
slug: /module-1/actions
---

# Chapter No.6: Actions

We've covered ROS 2 Topics for streaming data and Services for immediate request-response interactions. But what if your robot needs to perform a complex, long-running task that requires continuous feedback and has a defined goal that might take a while to achieve? This is precisely the domain of **ROS 2 Actions**.

Actions provide a robust way to handle long-running, goal-oriented tasks that can be preempted (cancelled), offer periodic feedback on their progress, and ultimately return a result. They are built on top of topics and services, combining their strengths for more sophisticated control.

## Analogy: Ordering Food at a Restaurant

Think about ordering food at a busy restaurant. This process is a perfect analogy for a ROS 2 Action:

*   **Goal**: You (the client) tell the kitchen (the action server) what food you want to order (the goal).
*   **Feedback**: While you wait, the waiter (feedback) might periodically tell you the status: "Your order is being prepared," "It's almost ready," or "There's a slight delay." You don't just send the order and wait silently.
*   **Result**: Eventually, the waiter brings your food (the result), and the order is complete.
*   **Preemption/Cancellation**: If you suddenly change your mind or need to leave, you can tell the waiter to cancel the order (preempt the action).

This interaction is more complex than a simple request (asking for the menu) or a continuous stream (the ambient restaurant noise), making it a great fit for the Action paradigm.

## The Action Client/Server Architecture

ROS 2 Actions involve three primary components:

*   **Action Goal**: The command or objective sent by the client to the server (e.g., "drive 5 meters forward").
*   **Action Feedback**: Periodic updates sent by the server to the client about the task's progress (e.g., "robot has driven 2 meters").
*   **Action Result**: The final outcome sent by the server to the client once the task is complete (e.g., "robot reached 5 meters successfully").

And two main actors:

*   **Action Server**: A node that offers an action. It receives goals, executes the task, provides feedback, and sends a final result. It can also handle preemption requests.
*   **Action Client**: A node that sends a goal to an action server, receives feedback as the task progresses, and waits for the final result. It can also request to cancel the goal.

## When to Use Actions

Actions are ideal for tasks such as:

*   **Navigation**: "Go to location X."
*   **Manipulation**: "Pick up object Y."
*   **Complex sensing**: "Scan the room for specific features."
*   **Any task requiring**: a clear goal, ongoing progress feedback, and the ability to be cancelled.

## Example: A Simple "Fibonacci" Action

Let's define an action that computes the Fibonacci sequence up to a given order. This will demonstrate the Goal, Feedback, and Result components.

### `Fibonacci.action` (Action Definition)

```
# Goal
int32 order
---
# Result
int32[] sequence
---
# Feedback
int32[] partial_sequence
```

### `fibonacci_action_server.py` (Action Server Node - Simplified Concept)

```python
import time
import rclpy
from rclpy.node import Node
from rclpy.action import ActionServer

from example_interfaces.action import Fibonacci # Replace with your custom action type
# from my_package.action import Fibonacci

class FibonacciActionServer(Node):

    def __init__(self):
        super().__init__('fibonacci_action_server')
        self._action_server = ActionServer(
            self,
            Fibonacci,
            'fibonacci',
            self.execute_callback)
        self.get_logger().info('Fibonacci Action Server ready.')

    def execute_callback(self, goal_handle):
        self.get_logger().info('Executing goal...')

        sequence = [0, 1]
        # Populate sequence with Fibonacci numbers
        for i in range(1, goal_handle.request.order):
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                self.get_logger().info('Goal canceled')
                return Fibonacci.Result()

            sequence.append(sequence[i] + sequence[i-1])

            # Publish feedback
            feedback_msg = Fibonacci.Feedback()
            feedback_msg.partial_sequence = sequence
            goal_handle.publish_feedback(feedback_msg)
            self.get_logger().info(f'Feedback: {feedback_msg.partial_sequence}')

            time.sleep(1) # Simulate long-running task

        goal_handle.succeed()

        result = Fibonacci.Result()
        result.sequence = sequence
        self.get_logger().info(f'Goal succeeded. Result: {result.sequence}')
        return result

def main(args=None):
    rclpy.init(args=args)
    node = FibonacciActionServer()
    rclpy.spin(node)
    rclpy.shutdown()
```

### `fibonacci_action_client.py` (Action Client Node - Simplified Concept)

```python
import rclpy
from rclpy.action import ActionClient
from rclpy.node import Node

from example_interfaces.action import Fibonacci # Replace with your custom action type
# from my_package.action import Fibonacci

class FibonacciActionClient(Node):

    def __init__(self):
        super().__init__('fibonacci_action_client')
        self._action_client = ActionClient(self, Fibonacci, 'fibonacci')

    def send_goal(self, order):
        goal_msg = Fibonacci.Goal()
        goal_msg.order = order

        self._action_client.wait_for_server()

        self._send_goal_future = self._action_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback)

        self._send_goal_future.add_done_callback(self.goal_response_callback)

    def goal_response_callback(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().info('Goal rejected :(')
            return

        self.get_logger().info('Goal accepted :)')

        self._get_result_future = goal_handle.get_result_async()
        self._get_result_future.add_done_callback(self.get_result_callback)

    def get_result_callback(self, future):
        result = future.result().result
        self.get_logger().info(f'Result: {result.sequence}')
        rclpy.shutdown()

    def feedback_callback(self, feedback_msg):
        self.get_logger().info(f'Received feedback: {feedback_msg.feedback.partial_sequence}')

def main(args=None):
    rclpy.init(args=args)

    action_client = FibonacciActionClient()
    action_client.send_goal(10) # Request Fibonacci sequence up to order 10

    rclpy.spin(action_client)

if __name__ == '__main__':
    main()
```

### Running the Action Server and Client:

1.  **Build Your Package**: Ensure your `Fibonacci.action` is properly defined and your package builds (which generates the Python interfaces for your action).
2.  **Start the Action Server**: In one terminal, run: `ros2 run <your_package_name> fibonacci_action_server`
3.  **Start the Action Client**: In another terminal, run: `ros2 run <your_package_name> fibonacci_action_client`

The client will request the Fibonacci sequence, and you'll see feedback on the client side as the server computes it, eventually receiving the full sequence.