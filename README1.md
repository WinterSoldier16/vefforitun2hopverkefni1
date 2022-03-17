# Vefforritun 2, 2021, hópverkefni 1

## Hópmeðlimir

Bjarki Már Gunnarsson - bmg18@hi.is

Veturliði Snær Gylfason - vsg8@hi.is

Lausn er keyrandi á:
herokuslóð

## Hvernig skal setja verkefnið upp

* createdb vef2-2021-h1
npm install
 # uppfæra env
npm run setup # býr til gagnagrunn, fyllir af gögnum, og sendir myndir á cloudinary
npm run dev # keyrir upp dev
npm run test # staðfestir virkni með testum

## Dæmi um köll í vefþjónustu í localhost, með postman

* Logga sig inn sem admin og fá token
    * POST http://localhost:3000/users/login
    * { "username": "admin", "password": "123"}
* 
    * GET http://localhost:3000/menu
    * 