# RadioMap.ca

RadioMap.ca provides a user-friendly map interface to explore radio stations worldwide. It uses open-source data from [radio-browser.info](https://radio-browser.info) to display radio station information so users can discover and listen to radio stations from around the globe.

## Features

- Interactive heatmap display of radio stations worldwide.
- Station information such as station name, logo and streaming codec.
- Mobile friendly design with pop out station list.
- Automatic HTTPS upgrades for radio stream URLs.

## Technologies

- Data is provided by [radio-browser.info](https://radio-browser.info), an open-source radio station database.
- Hosted with Cloudflare Workers and deployed globally.

## Installation

To run a local development copy of RadioMap.ca, follow these steps:

1. Clone the repo and navigate there:

   ```bash
   git clone https://github.com/garyli2/RadioMap.git && cd RadioMap
   ```

2. Install dependencies using pnpm:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm run dev
   ```

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code for your own projects.

Enjoy exploring radio stations worldwide!
