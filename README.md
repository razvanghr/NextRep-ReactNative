# NextRep - Fitness App

A fast React Native fitness app with exercise data and smart caching.

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your API key**
   Create a `.env` file:
   ```
   RAPIDAPI_KEY=your_rapidapi_key_here
   ```
   Get your free API key from [RapidAPI Gym-Fit](https://rapidapi.com/gym-fit/api/gym-fit)

3. **Run the app**
   ```bash
   npx expo start
   ```

## Features

- **Exercise Categories**: Chest, Arms, Legs, Back, Shoulders, Core
- **Exercise Details**: Instructions, target muscles, equipment needed
- **Fitness Calculators**: BMI, TDEE, BMR, IBW
- **Smart Caching**: Fast loading with automatic data caching
- **Dark/Light Theme**: Adapts to your preference

## Performance

- **First load**: Data fetched from API
- **Return visits**: Lightning-fast loading from cache
- **Background preloading**: Popular exercises ready instantly 