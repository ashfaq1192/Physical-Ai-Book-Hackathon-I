# Chapter No.2: Setup Gazebo

To start exploring digital twins with Gazebo, you first need to set up the environment. This guide will provide basic steps for installing Gazebo and getting a simple simulation running. We'll focus on integrating Gazebo with ROS 2, as this is a common setup for robotics development.

## Prerequisites

Before you begin, ensure you have:

*   **Ubuntu 22.04 LTS (Jammy Jellyfish)**: Gazebo is best supported on Ubuntu.
*   **ROS 2 Humble Hawksbill Installed**: Follow the instructions in Module 1 for setting up ROS 2 Humble.
*   **Internet Connection**: Required for downloading packages.

## Step-by-Step Installation Guide

### 1. Install Gazebo with ROS 2 Humble Integration

Gazebo for ROS 2 Humble is often referred to as "Ignition Gazebo" or "Gazebo Garden." You can install it via the ROS 2 metapackage.

```bash
sudo apt update
sudo apt install ros-humble-gazebo-ros-pkgs -y
```

This command installs Gazebo Garden along with the necessary ROS 2 integration packages (`gazebo_ros_pkgs`).

### 2. Verify Gazebo Installation

Once installed, you can launch Gazebo to ensure it's working correctly.

```bash
gazebo
```

A Gazebo simulation window should appear. If it does, congratulations! Gazebo is installed.

### 3. Source ROS 2 (If not already permanent)

Ensure your ROS 2 environment is sourced. If you followed Module 1, this should already be in your `.bashrc`.

```bash
source /opt/ros/humble/setup.bash
```

### 4. Run a Simple ROS 2 Gazebo Demo

Let's try launching a basic ROS 2 robot in Gazebo.

First, install the demo packages:

```bash
sudo apt install ros-humble-gazebo-ros-demos -y
```

Then, launch a differential drive robot in an empty world:

```bash
ros2 launch gazebo_ros_demos diff_drive.launch.py
```

You should see a simple robot spawning in Gazebo and moving. This confirms that Gazebo and ROS 2 are communicating correctly.

Congratulations! You have successfully set up a basic Gazebo environment integrated with ROS 2 Humble. You're now ready to start creating your own robot simulations!