---
title: "ROS 2 Services: Request-Response Communication"
sidebar_position: 5
slug: /module-1/services
---

# Chapter No.5: Services

While ROS 2 Topics are excellent for continuous, asynchronous data streams, sometimes your robot needs to perform a specific task and receive a direct result. This is where **ROS 2 Services** come in. Services provide a synchronous, request-response communication mechanism, allowing one node (the client) to send a request to another node (the server) and wait for a response.

## The Service/Client Architecture

Think of calling a function in a traditional programming language: you call the function, pass it some arguments, and it returns a value. ROS 2 Services operate similarly across different nodes:

*   **Service Server**: A node that offers a service. It waits for incoming requests, performs the requested computation, and sends back a response.
*   **Service Client**: A node that sends a request to a service server and waits until it receives a response.
*   **Service Definition**: A pair of message types defining the structure of the request and the response.

This model is suitable for:

*   **Discrete tasks**: Actions that have a clear start and end, and where a result is expected (e.g., "compute inverse kinematics," "take a single sensor reading," "toggle a light").
*   **Synchronous operations**: When the client needs to pause and wait for the server's response before continuing its own execution.

## How Services Work

1.  **Define Service Interface**: You define a `.srv` file that specifies the structure of the request and response messages. For example:
    ```
    # Request
    string text_to_reverse
    ---
    # Response
    string reversed_text
    ```
    (The `---` separates the request and response fields.)
2.  **Service Server**: A node implements the logic to handle incoming requests for this service. It advertises the service, making it available on the ROS 2 graph.
3.  **Service Client**: A node creates a client for this service. When it needs to use the service, it constructs a request message, sends it to the server, and waits for the response.

## Python Code Example: A Simple "Reverse String" Service

Let's consider a simple service that takes a string as a request and returns its reversed version as a response.

### `reverse_string.srv` (Service Definition)

```
string input
---
string output
```

### `minimal_service.py` (Service Server Node)

```python
import rclpy
from rclpy.node import Node

from example_interfaces.srv import AddTwoInts # Replace with your custom service type
# For custom service, you'd generate Python types from your .srv file during build
# from my_package.srv import ReverseString

class MinimalService(Node):

    def __init__(self):
        super().__init__('minimal_service')
        self.srv = self.create_service(AddTwoInts, 'add_two_ints', self.add_two_ints_callback)
        self.get_logger().info('Service `add_two_ints` ready.')

    def add_two_ints_callback(self, request, response):
        # Example: Using a built-in service, we will just add two ints
        response.sum = request.a + request.b
        self.get_logger().info(f'Incoming request: a={request.a} b={request.b}')
        self.get_logger().info(f'Sending response: {response.sum}')
        return response

def main(args=None):
    rclpy.init(args=args)

    minimal_service = MinimalService()

    rclpy.spin(minimal_service)

    rclpy.shutdown()
```

### `minimal_client.py` (Service Client Node)

```python
import sys
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy

from example_interfaces.srv import AddTwoInts # Replace with your custom service type
# from my_package.srv import ReverseString

class MinimalClientAsync(Node):

    def __init__(self):
        super().__init__('minimal_client_async')
        self.cli = self.create_client(AddTwoInts, 'add_two_ints')
        # Wait for service to be available
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('service not available, waiting again...')
        self.req = AddTwoInts.Request()

    def send_request(self, a, b):
        self.req.a = a
        self.req.b = b
        self.future = self.cli.call_async(self.req)
        # Instead of spin_until_future_complete, we might spin_once
        # or integrate into a larger node's spin loop.

def main(args=None):
    rclpy.init(args=args)

    minimal_client = MinimalClientAsync()
    # For simplicity, we are using sys.argv for arguments.
    # In a real application, these might come from parameters or other nodes.
    if len(sys.argv) == 3:
        minimal_client.send_request(int(sys.argv[1]), int(sys.argv[2]))
    else:
        minimal_client.get_logger().info('Usage: ros2 run <pkg_name> minimal_client_async A B')
        rclpy.shutdown()
        sys.exit(1)

    while rclpy.ok():
        rclpy.spin_once(minimal_client)
        if minimal_client.future.done():
            try:
                response = minimal_client.future.result()
            except Exception as e:
                minimal_client.get_logger().error('Service call failed %r' % (e,))
            else:
                minimal_client.get_logger().info(
                    'Result of add_two_ints: for %d + %d = %d' %
                    (minimal_client.req.a, minimal_client.req.b, response.sum))
            break

    minimal_client.destroy_node()
    rclpy.shutdown()
```

### Running the Service and Client:

1.  **Build Your Package**: Ensure your `reverse_string.srv` is properly defined and your package builds (which generates the Python interfaces for your service).
2.  **Start the Service Server**: In one terminal, run: `ros2 run <your_package_name> minimal_service`
3.  **Start the Service Client**: In another terminal, run: `ros2 run <your_package_name> minimal_client_async 5 3`

The client will send a request with 5 and 3, and the service will respond with 8.