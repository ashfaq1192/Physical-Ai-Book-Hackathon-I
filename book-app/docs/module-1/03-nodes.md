---
title: "ROS 2 Nodes: The Building Blocks of Your Robot's Brain"
sidebar_position: 3
slug: /module-1/nodes
---

# Chapter No.3: Nodes

In Module 1, we introduced the concept of ROS 2 as the "nervous system" of your robot. Now, let's delve into the fundamental units that make up this nervous system: **ROS 2 Nodes**. Just as neurons are the basic processing units of a biological nervous system, nodes are the atomic units of computation in a ROS 2 graph. They are independent executable programs that perform a specific task within the robot's software architecture.

## What is a ROS 2 Node?

A ROS 2 Node is essentially a single-purpose program that communicates with other nodes to achieve a larger objective. Each node typically handles a distinct functional block of the robot, such as:

*   Reading data from a sensor (e.g., a camera driver node).
*   Processing sensor data (e.g., an image processing node that detects objects).
*   Controlling a motor (e.g., a motor command node).
*   Planning a robot's path (e.g., a navigation planning node).

By breaking down complex robotics applications into smaller, manageable nodes, ROS 2 promotes modularity, reusability, and fault isolation. If one node crashes, it doesn't necessarily bring down the entire robot's software system.

## Anatomy of a ROS 2 Node

A typical ROS 2 node in Python involves:

1.  **Initialization**: Setting up the ROS 2 client library (`rclpy`).
2.  **Node Creation**: Creating an instance of a `Node` class.
3.  **Publishers/Subscribers/Services/Actions**: Defining communication interfaces (which we will explore in subsequent sections).
4.  **Spinning**: Entering a loop to process callbacks (e.g., incoming messages, service requests, action goals).
5.  **Shutdown**: Cleaning up resources upon termination.

## Python Code Example: A Simple "Hello ROS 2" Node

Let's create a basic ROS 2 node in Python that simply prints a message to the console. This will illustrate the minimal structure of a ROS 2 node.

```python
import rclpy
from rclpy.node import Node

class MinimalPublisher(Node):

    def __init__(self):
        super().__init__('minimal_publisher') # Node name
        self.timer = self.create_timer(0.5, self.timer_callback) # Timer to call callback every 0.5 seconds
        self.i = 0

    def timer_callback(self):
        msg = f'Hello ROS 2: {self.i}'
        self.get_logger().info(f'Publishing: "{msg}"') # Use get_logger() for ROS 2 logging
        self.i += 1

def main(args=None):
    rclpy.init(args=args) # Initialize the ROS 2 Python client library

    minimal_publisher = MinimalPublisher()

    rclpy.spin(minimal_publisher) # Keep the node alive until interrupted

    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Code Explanation:

*   **`import rclpy` and `from rclpy.node import Node`**: Imports the necessary ROS 2 Python client library and the base `Node` class.
*   **`class MinimalPublisher(Node):`**: Defines our custom node, inheriting from `rclpy.node.Node`.
*   **`super().__init__('minimal_publisher')`**: The constructor calls the base class constructor, giving our node the name `minimal_publisher`.
*   **`self.create_timer(0.5, self.timer_callback)`**: Creates a timer that will call the `timer_callback` method every 0.5 seconds. This is how the node performs periodic tasks.
*   **`self.get_logger().info(...)`**: This is the standard way to log messages in ROS 2. `info` is for informational messages.
*   **`rclpy.init(args=args)`**: Initializes the ROS 2 client library. This *must* be called at the beginning of any ROS 2 Python program.
*   **`rclpy.spin(minimal_publisher)`**: This function keeps the node alive, allowing its callbacks (like `timer_callback`) to be executed. It blocks until the node is explicitly shut down or `Ctrl+C` is pressed.
*   **`minimal_publisher.destroy_node()` and `rclpy.shutdown()`**: Clean up resources when the node is stopped.

## Running Your First ROS 2 Node

To run this node:

1.  Save the code as `minimal_publisher.py` in your ROS 2 workspace (e.g., `~/ros2_ws/src/my_package/my_package/minimal_publisher.py`).
2.  Build your package (if part of a larger package, using `colcon build`).
3.  Source your ROS 2 environment.
4.  Run the node using `ros2 run <your_package_name> minimal_publisher`.

You should see "Hello ROS 2" messages being printed periodically in your terminal.