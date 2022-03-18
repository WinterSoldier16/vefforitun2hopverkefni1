# Vefforritun 2, 2021, hópverkefni 1

## Hópmeðlimir

Bjarki Már Gunnarsson - bmg18@hi.is

Veturliði Snær Gylfason - vsg8@hi.is

Lausn er keyrandi á:
herokuslóð

## Hvernig skal setja verkefnið upp

npm install
 # uppfæra env
npm run setup # býr til gagnagrunn, fyllir af gögnum
npm run dev # keyrir upp dev
npm run start

## Dæmi um köll í vefþjónustu í localhost, með postman

* Logga sig inn sem admin og fá token
    * POST http://localhost:3000/users/login
    * { "username": "admin", "password": "123"}

* Skilar síðu af vörum á matseðli, raðað  
    * GET http://localhost:3000/menu

* býr til nýja vöru á matseðil ef hún er gild og notandi er stjórnandi
    * POST http://localhost:3000/menu
    * Bearer token
    * { "title": "ABC", "price": 123, "description": "Rosa gott", "flokkar": "Samlokur"}
    * Flokkar eru: [Hamborgarar, Samlokur. Allskonar, Kaffi, Desert]

* Skilar síðu af vörum í flokk, raðað í dagsetningar röð
    * GET http://localhost:3000/menu/?category={category}

* Skilar síðu af vörum þar sem {query} er í titli eða lýsingu
    * GET http://localhost:3000/menu/?search={query}

* Einnig er hægt að ger bæði category og search
    * GET http://localhost:3000/menu/?category={category}&search={query}

* Sækir vöru útfrá id
    * GET http://localhost:3000/menu/:id

* uppfærir vöru, aðeins ef notandi sem framkvæmir er stjórnandi
    * PATCH http://localhost:3000/menu/:id
    * Bearer token
    * { "title": "ABC", "price": 123, "description": "Rosa gott", "flokkar": "Samlokur"}

* eyðir vöru, aðeins ef notandi sem framkvæmir er stjórnandi
    * DELETE http://localhost:3000/menu/:id
    * Bearer token

Þetta eru dæmi um köll í vefþjónustur, það ætti að vera hægt að framkvæma öll köll eins og verkefnalýsing krefst
fyrir utan POST menu, þar er ekki hægt að upload-a mynd, við náðum ekki að láta cloudinary ganga upp, þannig það er
bara hægt að búa til vöru án myndar.

