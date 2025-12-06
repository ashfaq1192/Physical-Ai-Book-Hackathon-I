# Chapter No.3: URDF

Imagine a robot. How do you describe its physical structure, its moving parts, and how they connect? That's where URDF (Unified Robot Description Format) comes in. Think of URDF as the robot's DNA: a standardized XML file that precisely defines the robot's kinematic and dynamic properties, visual appearance, and collision geometry.

## What is URDF?

URDF is an XML format used in robotics to describe robot models. It's crucial for simulation, motion planning, and visualization. A URDF file is essentially a hierarchical description of a robot, composed of:

*   **Links**: These are the rigid bodies of the robot, like a robot's arm segment or a wheel. Links have physical properties such as mass, inertia, and visual/collision geometries.
*   **Joints**: These define the kinematic and dynamic relationship between two links. Joints specify how links move relative to each other (e.g., a revolute joint for rotation, a prismatic joint for sliding). Each joint connects a `parent` link to a `child` link.

## Structure of a URDF File

A basic URDF file starts with a `<robot>` tag, containing multiple `<link>` and `<joint>` definitions. Here's a simplified example:

```xml
<?xml version="1.0"?>
<robot name="simple_robot">

  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.6 0.4 0.2" />
      </geometry>
      <material name="blue">
        <color rgba="0 0 0.8 1" />
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.6 0.4 0.2" />
      </geometry>
    </collision>
    <inertial>
      <mass value="10" />
      <inertia ixx="1.0" ixy="0.0" ixz="0.0" iyy="1.0" iyz="0.0" izz="1.0" />
    </inertial>
  </link>

  <link name="arm_link">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.4" />
      </geometry>
      <material name="red">
        <color rgba="0.8 0 0 1" />
      </material>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.05" length="0.4" />
      </geometry>
    </collision>
    <inertial>
      <mass value="1" />
      <inertia ixx="0.1" ixy="0.0" ixz="0.0" iyy="0.1" iyz="0.0" izz="0.1" />
    </inertial>
  </link>

  <joint name="base_to_arm_joint" type="revolute">
    <parent link="base_link"/>
    <child link="arm_link"/>
    <origin xyz="0 0 0.3" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-1.57" upper="1.57" effort="100" velocity="100"/>
  </joint>

</robot>
```

### Key Elements Explained:

*   `<robot name="...">`: The root element, defining the robot's name.
*   `<link name="...">`: Defines a segment of the robot. It contains:
    *   `<visual>`: Describes the visual appearance (geometry, material).
    *   `<collision>`: Defines the collision geometry, often simplified for faster physics simulations.
    *   `<inertial>`: Specifies mass, center of mass, and inertia tensor for physics.
*   `<joint name="..." type="...">`: Connects two links. Key attributes include:
    *   `type`: e.g., `revolute` (rotational), `prismatic` (linear), `fixed` (no movement).
    *   `<parent link="..."/>`: The link closer to the robot's base.
    *   `<child link="..."/>`: The link further from the robot's base.
    *   `<origin xyz="..." rpy="...">`: Specifies the joint's position (x, y, z) and orientation (roll, pitch, yaw) relative to the parent link.
    *   `<axis xyz="...">`: Defines the axis of rotation or translation for revolute/prismatic joints.
    *   `<limit>`: For non-fixed joints, defines the range of motion, effort, and velocity limits.

URDF provides a powerful, standardized way to bring robot designs to life in simulations and real-world applications.