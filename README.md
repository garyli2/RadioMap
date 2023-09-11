# RadioMap.ca

RadioMap.ca is a side project that provides a user-friendly map interface to explore radio stations worldwide. It uses an open-source dataset from [radio-browser.info](https://radio-browser.info) to display radio station information, making it easy for users to discover and listen to radio stations from around the globe.

## Features

- Interactive heatmap display of radio stations worldwide.
- Station information, including station name, logo and streaming codec.
- Mobile friendly design with pop out station list.
- Automatic HTTPS upgrades for radio stream URLs.

## Technologies

- Data for this project is provided by [radio-browser.info](https://radio-browser.info), an open-source radio station database.
- Server side rendering via AWS Lambda with static frontend hosted on S3.
- Edge-optimized API endpoint in Gateway using CloudFront.

## Installation

To run a local development copy of RadioMap.ca, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/garyli2/RadioMap.git
   ```

2. Navigate to the project directory:

   ```bash
   cd RadioMap
   ```

3. Install the backend dependencies using [Yarn](https://yarnpkg.com/):

   ```bash
   cd backend
   yarn
   ```

4. Start the backend development server:

   ```bash
   yarn start
   ```

5. Likewise for frontend
   ```bash
   cd ../frontend
   yarn
   yarn start
   ```

5. Open your web browser and access `http://localhost:3000` to view the RadioMap.ca website.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code for your own projects.

Enjoy exploring radio stations worldwide!
