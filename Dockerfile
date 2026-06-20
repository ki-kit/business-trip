# Stage 1: Static Asset Compilation Build environment
FROM node:18-alpine AS build
WORKDIR /app

# Copies your new package.json file into the image
COPY package*.json ./

# Changed from npm ci to npm install with flags to speed up building
RUN npm install --no-audit --no-fund

# Copies the rest of your React app source files
COPY . .

# Compiles the React app into static files (creates the /app/dist folder)
RUN npm run build

# Stage 2: Low-footprint web proxy environment
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]