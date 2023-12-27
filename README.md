# Simulation of flying objects

> This test task involves creating a web application to simulate flying objects with specific behaviors. Let's break down the task into smaller components and outline a general approach to tackle it. Given the complexity, it's unlikely to complete the entire task within 20 hours, so focus on the core functionalities first.

## Running Instructions for the Node Vite Project

### Steps

0. **Configure Environment Variables**:
   - Copy the `.env.copy` file to a new file named `.env` in the root directory of your project.
   - Obtain a free token for `VITE_CESIUM_TOKEN` from [Cesium ion](https://ion.cesium.com/tokens).
   - Add the token to your `.env` file:

     ```env
     VITE_CESIUM_TOKEN=<your-cesium-token>
     ```

1. **Node Version**:
   - Ensure you are using Node.js LTS version 18 or higher. You can download and install it from [Node.js official website](https://nodejs.org/).

2. **Install Dependencies**:
   - Install the project dependencies using npm (Node Package Manager):

     ```sh
     npm install
     ```

3. **Start the Development Server**:
   - Run the Vite development server:

     ```sh
     npm run dev
     ```

   - The server should start, and you can view the application in your web browser at `http://localhost:3000` or another port specified in the console.

___

## Core Components

1. **Map Layer**:
   - Use a map library like Leaflet or Google Maps.
   - Initialize the map centered over Estonia.

2. **Map Navigation Controls**:
   - Implement zoom, move, and rotate controls. Both Leaflet and Google Maps provide built-in controls for these features.

3. **Interaction Layer**:
   - Implement functionalities to add SQUARE, CIRCLE, and TRIANGLE objects, each with specific behaviors:

   - **SQUARE**:
     - Starts in Estonia.
     - Moves at a random speed between 50 and 80 km/h.
     - Follows a Great Circle path, eventually returning to the start point.

   - **CIRCLE**:
     - Starts in Estonia.
     - Moves at a random speed between 110 and 300 km/h.
     - Moves on a circular path with a radius of 10,000 – 30,000m, and disappears after returning to the origin.

   - **TRIANGLE**:
     - Starts in Estonia.
     - Moves at a random speed between 1700 and 2200 km/h.
     - Heads to a random point on Earth on the shortest path.
     - Has a lifespan of one hour or until it reaches its destination.

4. **Object Control Layer**:
   - Capabilities to display and hide objects of type SQUARE, CIRCLE, and TRIANGLE.
   - Ensure each object is clickable.

5. **On Object Activation**:
   - Display the following information:
     - Speed.
     - Current location.
     - Time to expire.
     - Current trajectory.
     - A tail of the traveled trajectory in the last 60 seconds.

### Additional Notes

- The task is extensive and may not be completed in 20 hours.
- Use Leaflet or Google Maps as a map base.
- Utilize libraries and AI assistance as needed.
- Aim for a maximum of 5000 active objects.
- Object height is optional.
- Using WebGL is a bonus.
- Good UI design and graphical design are bonuses.
- Deliver the code with running instructions.
