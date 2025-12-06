# Chapter No.2: Setup

To begin our hands-on journey with ROS 2, the first step is to install it on your system. This module will guide you through the process of installing **ROS 2 Humble Hawksbill**, a Long Term Support (LTS) release, on **Ubuntu 22.04 (Jammy Jellyfish)**. While ROS 2 can be installed on other operating systems, Ubuntu is the most common and well-supported platform for ROS development.

## Prerequisites

Ensure your system is up-to-date and you have a fresh installation of Ubuntu 22.04 LTS. You'll also need an active internet connection.

## Step-by-Step Installation Guide

Follow these steps carefully to install ROS 2 Humble:

### 1. Set up Your Locale

First, ensure you have a "clean" environment that is compatible with UTF-8. This is a common requirement for many Linux tools, including ROS 2.

```bash
sudo apt update && sudo apt install locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8
```

Verify your locale settings:

```bash
locale
```

### 2. Add the ROS 2 APT Repository

ROS 2 packages are hosted in a dedicated repository. You need to add this to your system's software sources.

```bash
sudo apt install software-properties-common
sudo add-apt-repository universe

sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

### 3. Install ROS 2 Packages

Now you can install the actual ROS 2 packages. We will install the `desktop` variant, which includes ROS, RViz, and demos.

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install ros-humble-desktop -y
```

### 4. Source the ROS 2 Setup Script

To use ROS 2 commands, you need to source its setup script in each new terminal session. To make this permanent, add it to your `.bashrc`.

```bash
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

Verify the installation by running a ROS 2 command:

```bash
ros2 --version
```

### 5. Install `rosdep` (Optional but Recommended)

`rosdep` helps you install system dependencies for source packages.

```bash
sudo apt install python3-rosdep -y
sudo rosdep init
rosdep update
```

### 6. Install `colcon` (Optional but Recommended)

`colcon` is the recommended build tool for ROS 2. It's useful when you compile ROS 2 packages from source.

```bash
sudo apt install python3-colcon-common-extensions -y
```

Congratulations! You have successfully installed ROS 2 Humble. You are now ready to dive deeper into building robotic applications!