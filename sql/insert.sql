INSERT INTO users (email, username, password, admin) VALUES ('admin@admin.ad', 'admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', 'true');

INSERT INTO flokkur (title) VALUES ('Hamborgarar');
INSERT INTO flokkur (title) VALUES ('Samlokur');
INSERT INTO flokkur (title) VALUES ('Allskonar');
INSERT INTO flokkur (title) VALUES ('Kaffi');
INSERT INTO flokkur (title) VALUES ('Desert');

INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('OSTBORGARI', 1209, 'með osti, salati og hamborgarasósu', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647362586/vef2-h1/Cheeseburger_ggu7om.jpg', 'Hamborgarar');
INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('BEIKONBORGARI', 1319, 'með osti, salati, beikoni og hamborgarasósu', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647362914/vef2-h1/baconburger_nqeds7.jpg', 'Hamborgarar');
INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('BBQ-BORGARI', 1259, 'með osti, salati, svissuðum lauk og BBQ-sósu', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647362920/vef2-h1/bbqburger_v8tvbk.jpg', 'Hamborgarar');

INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('RISTUÐ SAMLOKA', 949, 'með skinku, osti og hamborgarasósu', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647363757/vef2-h1/GrilledSandwich_m2fvns.jpg', 'Samlokur');
INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('B.L.T. SAMLOKA', 1329, 'með skinku, osti, beikoni, salati, tómötum og sinnepssósu', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647363749/vef2-h1/BLTSandwich_eujczj.jpg', 'Samlokur');
INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('BAGUETTE', 839, 'með skinku, osti og sósu að eigin vali', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647363745/vef2-h1/baguette_z5glca.jpg', 'Samlokur');

INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('LAUKHRINGIR', 1019, 'Djúpsteiktir og brakandi', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647363757/vef2-h1/onionrings_epp3sl.jpg', 'Allskonar');
INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('KJÚKLINGANAGGAR', 1049, '6stk af ljúffengum nöggum', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647363754/vef2-h1/ChickenNuggets_vmtfb0.jpg', 'Allskonar');
INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('PYLSA M.ÖLLU', 519, 'ein með öllu', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647363757/vef2-h1/pmollu_rkpjvv.jpg', 'Allskonar');

INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('HEIT BEYGLA', 479, 'sjóðandi og æsandi', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647363757/vef2-h1/hotbagel_qmhlra.jpg', 'Kaffi');
INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('KLEINUHRINGUR', 369, 'sætur og gómsætur', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647363754/vef2-h1/donut_ixkukq.jpg', 'Kaffi');
INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('BEYGLA & KAFFI', 599, 'sjóðandi og orkumikil bomba', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647363741/vef2-h1/bagelcoffee_kwme7d.jpg', 'Kaffi');

INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('SHAKE LÍTILL', 899, 'lítill hristingur er góður', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647363753/vef2-h1/milkshake_qxftjl.jpg', 'Desert');
INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('SHAKE MIÐSTÆRÐ', 949, 'meðal hristingur er betri', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647363753/vef2-h1/milkshake_qxftjl.jpg', 'Desert');
INSERT INTO vorur (title, price, description, image, flokkar) VALUES ('SHAKE STÓR', 999, 'stór hristingur er bestur', 'https://res.cloudinary.com/hbv2-h1/image/upload/v1647363753/vef2-h1/milkshake_qxftjl.jpg', 'Desert');