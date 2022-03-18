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
* Finna allar vörur
    * GET http://localhost:3000/menu
* Leita að vöru eftir flokki (category)
    * GET http://localhost:3000/menu?category={category}
* Leita að vöru þar sem ákveðið search query kemur fyrir í titli eða lýsingu
    * GET http://localhost:3000/menu?search={query}
* Hægt að leita bæði eftir flokki og með sérstöku search query á sama tíma
    * GET http://localhost:3000/menu?category={category}?search={query}
* Býr til körfu og skilar ID hennar, þarft ekki að vera logged in
    * POST http://localhost:3000/cart