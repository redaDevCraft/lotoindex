// @ts-nocheck
const { run, get } = require('./db.js')

const SEED_DATA = [

    // ════════════════════════════════════════════════════
    //  FRENCH
    // ════════════════════════════════════════════════════
    {
        make: 'PEUGEOT',
        models: [
            { name: '106', subs: ['1.0', '1.1', '1.4', '1.6 16V', '1.9 D', 'GTI'] },
            {
                name: '206',
                subs: [
                    '1.1 MT', '1.4 MT', '1.4 AT', '1.6 MT', '1.6 AT',
                    '2.0 HDI MT', '1.9 D MT', 'CC 1.6', 'SW 1.6', 'SW 2.0 HDI',
                ]
            },
            {
                name: '207',
                subs: [
                    '1.4 VTI MT', '1.4 VTI AT', '1.6 VTI MT', '1.6 VTI AT',
                    '1.6 HDI MT', '1.6 HDI AT', 'CC 1.6 VTI', 'SW 1.6 HDI',
                ]
            },
            {
                name: '208',
                subs: [
                    '1.0 PureTech 68 MT', '1.2 PureTech 82 MT', '1.2 PureTech 100 AT',
                    '1.5 BlueHDI 100 MT', '1.6 HDI 92 MT',
                    'e-208 EV', 'GTI 1.6 THP 208',
                ]
            },
            {
                name: '301',
                subs: [
                    '1.2 VTI 72 MT', '1.2 PureTech 82 MT', '1.6 VTI 115 MT', '1.6 VTI AT',
                    '1.6 HDI 92 MT', '1.6 BlueHDI 100 MT',
                    'Allure 1.6 BlueHDI', 'Active 1.2 PureTech',
                ]
            },
            {
                name: '307',
                subs: [
                    '1.4 MT', '1.6 MT', '1.6 AT', '2.0 MT',
                    '1.6 HDI MT', '2.0 HDI MT', '2.0 HDI AT',
                    'SW 1.6 HDI', 'CC 2.0',
                ]
            },
            {
                name: '308',
                subs: [
                    '1.2 PureTech 110 MT', '1.2 PureTech 130 AT', '1.6 THP 156 MT',
                    '1.6 HDI 92 MT', '2.0 HDI 150 AT',
                    'SW 1.5 BlueHDI', 'SW 2.0 BlueHDI',
                    'GT 1.6 THP AT', 'GT Line 1.2 PureTech',
                ]
            },
            {
                name: '3008',
                subs: [
                    '1.2 PureTech 130 MT', '1.2 PureTech 130 AT',
                    '1.6 THP 165 AT', '1.6 BlueHDI 120 MT', '1.6 BlueHDI 120 AT',
                    '2.0 BlueHDI 150 AT', '2.0 BlueHDI 180 AT',
                    'GT Line 1.6 BlueHDI', 'Allure 1.2 PureTech',
                    'HYbrid4 2.0 PHEV',
                ]
            },
            {
                name: '5008',
                subs: [
                    '1.2 PureTech 130 AT', '1.6 THP 165 AT',
                    '1.6 BlueHDI 120 AT', '2.0 BlueHDI 150 AT', '2.0 BlueHDI 180 AT',
                    'GT Line 2.0 BlueHDI', 'Allure 1.6 BlueHDI',
                ]
            },
            {
                name: '406',
                subs: [
                    '1.6 MT', '1.8 MT', '2.0 MT', '2.0 AT',
                    '1.9 TD MT', '2.0 HDI MT', '2.0 HDI AT', '2.2 HDI AT',
                    'Coupé 2.0 HDI',
                ]
            },
            {
                name: '407',
                subs: [
                    '1.6 HDI 110 MT', '2.0 HDI 136 MT', '2.0 HDI 163 AT',
                    '2.7 HDI V6 AT', '2.0 MT', '2.2 AT', '3.0 V6 AT',
                    'SW 2.0 HDI', 'SW 2.7 HDI',
                ]
            },
            {
                name: '508',
                subs: [
                    '1.6 THP 156 AT', '2.0 AT',
                    '1.6 BlueHDI 120 AT', '2.0 HDI 140 AT', '2.0 BlueHDI 150 AT', '2.0 BlueHDI 180 AT',
                    'SW 2.0 BlueHDI', 'RXH 2.0 Hybrid4',
                    'GT 2.0 BlueHDI',
                ]
            },
            {
                name: 'Partner',
                subs: [
                    '1.2 PureTech MT', '1.4 MT', '1.6 MT',
                    '1.5 BlueHDI 75 MT', '1.5 BlueHDI 100 MT', '1.6 HDI MT', '1.9 D MT',
                    'Tepee 1.6 HDI',
                ]
            },
            { name: 'Expert', subs: ['1.6 HDI 90 MT', '1.6 HDI 115 MT', '2.0 HDI 120 MT', '2.0 BlueHDI 150 AT'] },
            { name: 'Boxer', subs: ['2.0 HDI 110 MT', '2.2 HDI 130 MT', '3.0 HDI 160 MT', '3.0 HDI 180 AT'] },
        ]
    },

    {
        make: 'RENAULT',
        models: [{
                name: 'Clio',
                subs: [
                    // Gen II / III (common used imports)
                    '1.2 16V MT (2001–2012)', '1.4 16V MT (2001–2012)', '1.6 16V MT (2001–2012)',
                    '1.5 dCi 65 MT (2001–2012)', '1.5 dCi 85 MT (2001–2012)',
                    '1.9 D MT', 'RS 2.0 16V MT',
                    // Gen IV
                    '0.9 TCe 90 MT (IV)', '1.2 16V MT (IV)', '1.5 dCi 75 MT (IV)', '1.5 dCi 90 MT (IV)',
                    'RS 200 EDC (IV)',
                    // Gen V
                    '1.0 SCe 65 MT (V)', '1.0 TCe 100 MT (V)', '1.5 dCi 85 MT (V)', 'E-Tech Hybrid (V)',
                ]
            },
            {
                name: 'Megane',
                subs: [
                    '1.4 16V MT', '1.6 16V MT', '1.6 16V AT', '2.0 16V MT',
                    '1.5 dCi 80 MT', '1.5 dCi 105 MT', '1.9 dCi MT',
                    'CC 1.6 MT', 'SW 1.5 dCi', 'RS 265 MT (III)', 'RS 280 EDC (IV)',
                    '1.2 TCe 130 MT (IV)', '1.3 TCe 140 EDC (IV)', '1.5 dCi 110 EDC (IV)',
                ]
            },
            {
                name: 'Scenic',
                subs: [
                    '1.4 MT', '1.6 MT', '2.0 AT', '1.5 dCi 85 MT', '1.5 dCi 110 MT', '1.9 dCi MT',
                    'Grand Scenic 1.5 dCi', 'Grand Scenic 1.9 dCi', 'Grand Scenic 2.0 dCi',
                ]
            },
            {
                name: 'Laguna',
                subs: [
                    '1.6 MT', '1.8 MT', '2.0 MT', '2.0 AT',
                    '1.9 dCi MT', '2.0 dCi AT', '3.0 V6 AT',
                    'Coupé 2.0T', 'Coupé 3.0 dCi',
                ]
            },
            {
                name: 'Kangoo',
                subs: [
                    '1.2 MT', '1.4 MT', '1.6 MT', '1.6 AT',
                    '1.5 dCi 70 MT', '1.5 dCi 90 MT', '1.9 D MT',
                    'Maxi 1.5 dCi', 'Z.E. EV',
                ]
            },
            { name: 'Trafic', subs: ['1.9 dCi 100 MT', '2.0 dCi 115 MT', '2.5 dCi 145 MT', '2.0 dCi AT'] },
            { name: 'Master', subs: ['2.3 dCi 110 MT', '2.3 dCi 135 MT', '2.3 dCi 170 AT', '2.5 dCi 120 MT'] },
            {
                name: 'Symbol',
                subs: [
                    '1.2 16V MT', '1.4 16V MT', '1.6 16V MT', '1.6 16V AT',
                    '1.5 dCi 70 MT', '1.5 dCi 85 MT',
                ]
            },
            {
                name: 'Logan',
                subs: [
                    '1.0 SCe 65 MT', '1.2 16V MT', '1.4 MT', '1.6 MT', '1.6 AT',
                    '1.5 dCi 75 MT', '1.5 dCi 90 MT',
                    'MCV 1.5 dCi',
                ]
            },
            {
                name: 'Sandero',
                subs: [
                    '1.0 SCe 65 MT', '1.0 TCe 90 MT', '1.2 16V MT', '1.6 MT',
                    '1.5 dCi 75 MT', '1.5 dCi 90 MT',
                    'Stepway 0.9 TCe', 'Stepway 1.5 dCi', 'RS 2.0 MT',
                ]
            },
            {
                name: 'Duster',
                subs: [
                    '1.2 TCe 125 MT', '1.3 TCe 130 MT', '1.6 MT', '1.6 AT', '2.0 AT 4x4',
                    '1.5 dCi 90 MT', '1.5 dCi 110 MT 4x4',
                    'Prestige 1.5 dCi', 'Comfort 1.6 MT',
                ]
            },
            {
                name: 'Captur',
                subs: [
                    '0.9 TCe 90 MT', '1.2 TCe 120 AT', '1.3 TCe 130 AT',
                    '1.5 dCi 90 MT', '1.5 dCi 110 AT',
                    'E-Tech Hybrid 145', 'Intens 1.3 TCe', 'Zen 0.9 TCe',
                ]
            },
            {
                name: 'Kadjar',
                subs: [
                    '1.2 TCe 130 MT', '1.6 TCe 165 AT', '1.3 TCe 140 AT',
                    '1.5 dCi 110 MT', '1.5 dCi 110 AT', '1.6 dCi 130 AT',
                    'Intens 1.3 TCe', 'Business 1.5 dCi',
                ]
            },
            {
                name: 'Koleos',
                subs: [
                    '2.0 MT', '2.0 AT', '2.5 AT', '2.0 dCi AT', '4WD 2.5 AT',
                    'Zen 2.0 AT', 'Intens 2.5 AT', 'Initiale 2.5 AT',
                ]
            },
            {
                name: 'Fluence',
                subs: [
                    '1.5 dCi 85 MT', '1.5 dCi 110 MT', '1.5 dCi AT',
                    '1.6 MT', '1.6 AT', '2.0 AT',
                    'Z.E. EV',
                ]
            },
            {
                name: 'Talisman',
                subs: [
                    '1.3 TCe 130 AT', '1.6 TCe 200 AT',
                    '1.5 dCi 110 AT', '1.6 dCi 130 AT', '1.6 dCi 160 AT',
                    'Zen 1.5 dCi', 'Intens 1.6 dCi', 'SW 1.6 dCi',
                ]
            },
            {
                name: 'Arkana',
                subs: [
                    '1.3 TCe 140 EDC', '1.6 MT', '1.6 AT',
                    'E-Tech Hybrid 145', 'Zen 1.3 TCe', 'Intens E-Tech',
                ]
            },
        ]
    },

    {
        make: 'CITROEN',
        models: [
            { name: 'C1', subs: ['1.0 VTi 68 MT', '1.2 PureTech 82 MT', '1.4 HDI 70 MT'] },
            { name: 'C2', subs: ['1.1 MT', '1.4 MT', '1.6 VTi MT', '1.4 HDI MT', '1.6 HDI MT', 'VTS 1.6'] },
            {
                name: 'C3',
                subs: [
                    '1.0 PureTech 68 MT', '1.2 PureTech 82 MT', '1.2 PureTech 110 AT',
                    '1.4 MT', '1.6 MT', '1.4 HDI 70 MT', '1.6 HDI 92 MT',
                    'Shine 1.2 PureTech', 'Feel 1.2 PureTech',
                ]
            },
            {
                name: 'C3 Aircross',
                subs: [
                    '1.2 PureTech 110 MT', '1.2 PureTech 130 AT',
                    '1.5 BlueHDI 100 MT', '1.5 BlueHDI 110 AT',
                    'Shine 1.2 PureTech', 'Feel 1.5 BlueHDI',
                ]
            },
            {
                name: 'C4',
                subs: [
                    '1.2 PureTech 130 AT', '1.4 MT', '1.6 MT', '1.6 AT',
                    '1.6 HDI 90 MT', '1.6 HDI 110 MT', '2.0 HDI AT',
                    'Cactus 1.2 PureTech', 'Picasso 1.6 HDI',
                    'ë-C4 EV',
                ]
            },
            {
                name: 'C5',
                subs: [
                    '1.6 MT', '1.8 AT', '2.0 AT', '3.0 V6 AT',
                    '1.6 HDI 109 MT', '2.0 HDI 140 AT', '2.2 HDI 170 AT', '2.7 HDI V6 AT',
                    'X7 2.0 HDI AT', 'X7 3.0 HDI AT',
                ]
            },
            {
                name: 'Berlingo',
                subs: [
                    '1.2 PureTech 110 MT', '1.6 MT',
                    '1.5 BlueHDI 75 MT', '1.5 BlueHDI 100 MT', '1.6 HDI 75 MT', '1.6 HDI 90 MT',
                    'Multispace 1.6 HDI',
                ]
            },
            { name: 'Jumpy', subs: ['1.6 HDI 90 MT', '1.6 HDI 115 MT', '2.0 HDI 120 MT', '2.0 BlueHDI 150 AT'] },
            { name: 'Jumper', subs: ['2.0 HDI 110 MT', '2.2 HDI 130 MT', '3.0 HDI 160 MT'] },
            {
                name: 'Xsara',
                subs: [
                    '1.4 MT', '1.6 MT', '1.6 AT', '1.9 D MT', '2.0 HDI MT',
                    'Picasso 1.6 HDI', 'Picasso 2.0 HDI',
                ]
            },
            { name: 'C8', subs: ['2.0 MT', '2.2 AT', '2.0 HDI MT', '2.2 HDI AT'] },
        ]
    },

    {
        make: 'DACIA',
        models: [{
                name: 'Logan',
                subs: [
                    '1.0 SCe 65 MT', '1.2 16V MT', '1.4 MT', '1.6 MT', '1.6 AT',
                    '1.5 dCi 75 MT', '1.5 dCi 90 MT', 'MCV 1.5 dCi',
                    'Prestige 1.5 dCi', 'Laureate 1.6 MT',
                ]
            },
            {
                name: 'Sandero',
                subs: [
                    '1.0 SCe 65 MT', '1.0 TCe 90 MT', '1.2 16V MT',
                    '1.5 dCi 75 MT', '1.5 dCi 90 MT',
                    'Stepway 0.9 TCe', 'Stepway 1.5 dCi',
                ]
            },
            {
                name: 'Duster',
                subs: [
                    '1.0 TCe 100 MT', '1.3 TCe 130 MT', '1.6 SCe 115 MT', '1.6 MT 4x4',
                    '1.5 dCi 90 MT', '1.5 dCi 110 MT', '1.5 dCi 110 AT', '1.5 Blue dCi 115 4x4',
                    'Prestige 1.5 dCi', 'Comfort 1.0 TCe',
                ]
            },
            { name: 'Lodgy', subs: ['1.2 TCe 115 MT', '1.5 dCi 90 MT', '1.5 dCi 110 MT', '1.6 SCe MT'] },
            { name: 'Dokker', subs: ['1.2 TCe MT', '1.5 dCi 75 MT', '1.5 dCi 90 MT', '1.6 SCe MT'] },
            { name: 'Spring', subs: ['EV 33 kWh', 'EV Comfort', 'EV Extreme'] },
        ]
    },

    // ════════════════════════════════════════════════════
    //  GERMAN
    // ════════════════════════════════════════════════════
    {
        make: 'VOLKSWAGEN',
        models: [{
                name: 'Golf',
                subs: [
                    // IV (1997–2003)
                    '1.4 MT (IV)', '1.6 MT (IV)', '1.8T MT (IV)', '1.9 TDI MT (IV)', '1.9 TDI AT (IV)',
                    'GTI 1.8T (IV)',
                    // V / VI (2003–2013)
                    '1.4 TSI MT (V/VI)', '1.6 TDI MT (V/VI)', '2.0 TDI MT (V/VI)',
                    'GTI 2.0 TSI MT (VI)', 'R 2.0 TSI 4Motion (VI)',
                    // VII
                    '1.0 TSI 115 MT (VII)', '1.4 TSI 125 AT (VII)',
                    '1.6 TDI 105 MT (VII)', '2.0 TDI 150 DSG (VII)',
                    'GTI 2.0 TSI 230 DSG (VII)', 'R 2.0 TSI 310 4Motion (VII)',
                    // VIII
                    '1.0 eTSI 110 DSG (VIII)', '1.5 eTSI 150 DSG (VIII)',
                    'GTI 2.0 TSI 245 DSG (VIII)',
                    'Plus 1.6 TDI', 'SW 1.6 TDI',
                ]
            },
            {
                name: 'Polo',
                subs: [
                    '1.0 MPI 65 MT', '1.0 TSI 95 MT', '1.0 TSI 95 AT',
                    '1.2 MT', '1.4 MT', '1.2 TSI 90 MT', '1.4 TDI 90 MT', '1.6 TDI 95 MT',
                    'GTI 2.0 TSI 200 DSG',
                ]
            },
            {
                name: 'Passat',
                subs: [
                    '1.4 TSI 122 MT', '1.4 TSI 150 DSG', '1.8 TSI AT',
                    '1.6 TDI 105 MT', '2.0 TDI 140 MT', '2.0 TDI 150 DSG', '2.0 TDI 190 DSG',
                    'Variant 2.0 TDI DSG', 'Alltrack 2.0 TDI 4Motion',
                ]
            },
            {
                name: 'Tiguan',
                subs: [
                    '1.4 TSI 122 MT', '1.4 TSI 150 AT', '2.0 TSI 180 AT',
                    '1.6 TDI 105 MT', '2.0 TDI 140 AT', '2.0 TDI 150 DSG', '2.0 TDI 190 4Motion',
                    'Allspace 2.0 TSI', 'Allspace 2.0 TDI',
                    'R-Line 2.0 TSI',
                ]
            },
            {
                name: 'Touareg',
                subs: [
                    '2.0 TSI eHybrid', '3.0 TSI V6 AT', '3.0 TDI V6 AT', '3.0 TDI V6 4Motion',
                    'R-Line 3.0 TDI',
                ]
            },
            {
                name: 'Caddy',
                subs: [
                    '1.2 TSI MT', '1.4 TSI MT', '1.4 MT', '2.0 TDI MT', '1.6 TDI MT',
                    'Maxi 2.0 TDI',
                ]
            },
            {
                name: 'Transporter',
                subs: [
                    '1.9 TDI 102 MT (T5)', '2.0 TDI 102 MT (T5)', '2.0 TDI 140 AT (T5)',
                    '2.5 TDI MT (T5)', '2.0 TDI 110 MT (T6)', '2.0 TDI 150 DSG (T6)',
                ]
            },
            { name: 'Crafter', subs: ['2.0 TDI 102 MT', '2.0 TDI 140 AT', '2.5 TDI MT'] },
            { name: 'Touran', subs: ['1.5 TSI AT', '1.0 TSI MT', '1.6 TDI MT', '2.0 TDI DSG'] },
        ]
    },

    {
        make: 'BMW',
        models: [{
                name: 'Série 1',
                subs: [
                    '114i', '116i', '118i', '120i', '125i',
                    '116d', '118d', '120d', '125d',
                    'M135i xDrive',
                ]
            },
            {
                name: 'Série 3',
                subs: [
                    '316i', '318i', '320i', '325i', '328i', '330i',
                    '316d', '318d', '320d', '320d xDrive', '325d', '330d',
                    'M3 Competition',
                    'Touring 320d',
                ]
            },
            {
                name: 'Série 5',
                subs: [
                    '518d', '520i', '523i', '525i', '530i',
                    '520d', '525d', '530d', '540d',
                    'M5 Competition',
                    'Touring 520d',
                ]
            },
            {
                name: 'X1',
                subs: [
                    'sDrive18i', 'sDrive20i', 'xDrive20i', 'xDrive25i',
                    'sDrive18d', 'xDrive20d', 'xDrive25d',
                ]
            },
            {
                name: 'X3',
                subs: [
                    'sDrive18i', 'xDrive20i', 'xDrive28i', 'xDrive30i',
                    'xDrive18d', 'xDrive20d', 'xDrive30d',
                    'M40i',
                ]
            },
            {
                name: 'X5',
                subs: [
                    'xDrive30i', 'xDrive40i', 'xDrive50i',
                    'xDrive25d', 'xDrive30d', 'xDrive40d',
                    'M50d', 'xDrive45e PHEV',
                ]
            },
            { name: 'Série 2', subs: ['218i Active Tourer', '220i Active Tourer', '218d Active Tourer', '218d Gran Tourer'] },
        ]
    },

    {
        make: 'MERCEDES',
        models: [{
                name: 'Classe A',
                subs: [
                    'A160 MT', 'A180 MT', 'A180 AT', 'A200 AT',
                    'A180d MT', 'A200d AT',
                    'A35 AMG 4MATIC', 'A45 AMG 4MATIC',
                ]
            },
            {
                name: 'Classe C',
                subs: [
                    'C180 MT', 'C180 AT', 'C200 AT', 'C250 AT', 'C300 AT',
                    'C200d AT', 'C220d AT', 'C250d AT', 'C300d AT',
                    'C43 AMG 4MATIC', 'C63 AMG', 'C63 S AMG',
                    'SW C220d', 'SW C300d',
                ]
            },
            {
                name: 'Classe E',
                subs: [
                    'E200 AT', 'E250 AT', 'E300 AT', 'E350 AT',
                    'E200d AT', 'E220d AT', 'E300d AT', 'E350d AT',
                    'E43 AMG 4MATIC', 'E63 AMG S',
                    'SW E220d', 'SW E300d',
                ]
            },
            {
                name: 'GLC',
                subs: [
                    'GLC200 AT', 'GLC250 AT', 'GLC300 4MATIC',
                    'GLC200d AT', 'GLC220d AT', 'GLC250d AT', 'GLC300d 4MATIC',
                    'GLC43 AMG', 'GLC63 AMG',
                    'Coupé GLC250', 'GLC 300e PHEV',
                ]
            },
            {
                name: 'GLA',
                subs: [
                    'GLA200 AT', 'GLA220 4MATIC', 'GLA250 4MATIC',
                    'GLA200d AT', 'GLA220d 4MATIC',
                    'GLA35 AMG',
                ]
            },
            { name: 'Classe B', subs: ['B180 MT', 'B200 AT', 'B180d MT', 'B200d AT'] },
            { name: 'Sprinter', subs: ['213 CDI MT', '216 CDI MT', '313 CDI MT', '316 CDI MT', '416 CDI AT', '516 CDI AT'] },
            { name: 'Vito', subs: ['109 CDI MT', '111 CDI MT', '114 CDI AT', '116 CDI AT', 'Tourer 116 CDI'] },
        ]
    },

    {
        make: 'AUDI',
        models: [{
                name: 'A1',
                subs: [
                    '1.0 TFSI 95 MT', '1.0 TFSI 95 AT', '1.2 TFSI 86 MT',
                    '1.4 TFSI 125 MT', '1.8 TFSI 192 DSG',
                    '1.6 TDI 116 MT', 'S1 2.0 TFSI Quattro',
                ]
            },
            {
                name: 'A3',
                subs: [
                    '1.0 TFSI 115 MT', '1.2 TFSI 105 MT', '1.4 TFSI 125 MT',
                    '1.5 TFSI 150 DSG', '2.0 TFSI 190 DSG',
                    '1.6 TDI 116 MT', '2.0 TDI 150 DSG', '2.0 TDI 184 DSG',
                    'S3 2.0 TFSI Quattro', 'RS3 2.5 TFSI',
                    'Sportback 1.5 TFSI', 'Cabriolet 1.8 TFSI',
                ]
            },
            {
                name: 'A4',
                subs: [
                    '1.4 TFSI 150 MT', '2.0 TFSI 190 DSG', '1.8 TFSI 170 MT',
                    '2.0 TDI 122 MT', '2.0 TDI 150 DSG', '2.0 TDI 190 DSG', '3.0 TDI 272 Quattro',
                    'S4 3.0 TFSI Quattro', 'RS4 2.9 TFSI Quattro',
                    'Avant 2.0 TDI',
                ]
            },
            {
                name: 'Q3',
                subs: [
                    '1.4 TFSI 150 MT', '2.0 TFSI 180 Quattro', '1.5 TFSI 150 DSG',
                    '1.6 TDI 116 MT', '2.0 TDI 150 DSG', '2.0 TDI 184 Quattro',
                    'RS Q3 2.5 TFSI',
                ]
            },
            {
                name: 'Q5',
                subs: [
                    '2.0 TFSI 190 Quattro', '3.0 TFSI 272 Quattro',
                    '2.0 TDI 163 Quattro', '2.0 TDI 190 Quattro', '3.0 TDI 286 Quattro',
                    'SQ5 3.0 TFSI', 'Q5 55 TFSI e PHEV',
                ]
            },
            { name: 'A6', subs: ['2.0 TFSI AT', '3.0 TFSI Quattro', '2.0 TDI AT', '3.0 TDI Quattro', 'S6 4.0 TFSI', 'Avant 3.0 TDI'] },
        ]
    },

    {
        make: 'OPEL',
        models: [{
                name: 'Corsa',
                subs: [
                    '1.0 MT', '1.2 MT', '1.2 Turbo 100 AT', '1.4 MT', '1.4 Turbo MT',
                    '1.3 CDTI 70 MT', '1.3 CDTI 95 MT', '1.7 CDTI MT',
                    'OPC 1.6T', 'e-Corsa EV',
                ]
            },
            {
                name: 'Astra',
                subs: [
                    '1.0 Turbo MT', '1.2 Turbo 110 MT', '1.4 Turbo 140 MT', '1.6 Turbo 200 AT',
                    '1.5 CDTI 105 MT', '1.6 CDTI 110 MT', '2.0 CDTI 165 AT',
                    'Sports Tourer 1.6 CDTI', 'GTC 2.0 OPC',
                ]
            },
            {
                name: 'Insignia',
                subs: [
                    '1.4 Turbo 140 MT', '1.6 Turbo 170 AT', '2.0 Turbo 220 AT',
                    '1.6 CDTI 110 MT', '2.0 CDTI 130 AT', '2.0 CDTI 170 AT',
                    'Grand Sport 2.0 CDTI', 'SW 2.0 CDTI',
                    'GSi 2.0 Turbo 4x4',
                ]
            },
            { name: 'Zafira', subs: ['1.4 Turbo 140 MT', '1.6 CDTI 110 MT', '2.0 CDTI 130 AT', 'Tourer 2.0 CDTI'] },
            {
                name: 'Mokka',
                subs: [
                    '1.0 Turbo MT', '1.4 Turbo 140 MT', '1.4 Turbo 152 AT',
                    '1.6 CDTI 110 MT', 'e-Mokka EV',
                ]
            },
            { name: 'Vivaro', subs: ['1.6 CDTI 90 MT', '1.6 CDTI 120 MT', '2.0 CDTI 120 MT', 'Combi 1.6 CDTI'] },
            { name: 'Movano', subs: ['2.3 CDTI 110 MT', '2.3 CDTI 145 AT', '2.5 CDTI MT'] },
        ]
    },

    {
        make: 'SEAT',
        models: [
            { name: 'Ibiza', subs: ['1.0 MPI 80 MT', '1.0 TSI 95 MT', '1.0 TSI 115 AT', '1.2 TSI 90 MT', '1.4 TDI 90 MT', '1.6 TDI 95 MT', 'FR 1.0 TSI 115', 'Cupra 2.0 TSI 306'] },
            { name: 'Leon', subs: ['1.0 TSI 110 MT', '1.5 TSI 130 AT', '1.6 TDI 115 MT', '2.0 TDI 150 DSG', 'FR 1.5 TSI', 'Cupra 2.0 TSI 300', 'ST 1.6 TDI', 'SC 1.4 TSI'] },
            { name: 'Ateca', subs: ['1.0 TSI 115 MT', '1.5 TSI 150 AT', '2.0 TSI 190 4Drive', '1.6 TDI 115 MT', '2.0 TDI 150 DSG', 'FR 2.0 TSI', 'Cupra 2.0 TSI 300 4Drive'] },
            { name: 'Alhambra', subs: ['1.4 TSI 150 MT', '2.0 TSI 220 DSG', '1.6 TDI 115 MT', '2.0 TDI 150 DSG'] },
            { name: 'Tarraco', subs: ['1.5 TSI 150 MT', '2.0 TSI 190 4Drive', '2.0 TDI 150 DSG', '2.0 TDI 190 4Drive', 'FR 2.0 TSI'] },
        ]
    },

    {
        make: 'SKODA',
        models: [
            { name: 'Fabia', subs: ['1.0 MPI 65 MT', '1.0 MPI 75 MT', '1.0 TSI 95 MT', '1.0 TSI 110 MT', '1.2 TSI 90 MT', '1.4 TDI 90 MT', '1.6 TDI 95 MT', 'RS 2.0 TSI'] },
            { name: 'Octavia', subs: ['1.0 TSI 115 MT', '1.5 TSI 150 DSG', '1.4 TSI 125 MT', '1.6 TDI 115 MT', '2.0 TDI 150 DSG', '2.0 TDI 184 DSG', 'RS 2.0 TSI', 'Scout 2.0 TDI 4x4', 'Combi 2.0 TDI'] },
            { name: 'Superb', subs: ['1.5 TSI 150 DSG', '2.0 TSI 190 DSG', '1.6 TDI 120 MT', '2.0 TDI 150 DSG', '2.0 TDI 190 4x4', 'L&K 2.0 TDI', 'Combi 2.0 TDI'] },
            { name: 'Kodiaq', subs: ['1.5 TSI 150 DSG', '2.0 TSI 180 DSG 4x4', '1.6 TDI 115 MT', '2.0 TDI 150 DSG', '2.0 TDI 190 4x4', 'RS 2.0 TSI', 'Sportline 2.0 TDI'] },
            { name: 'Karoq', subs: ['1.0 TSI 115 MT', '1.5 TSI 150 DSG', '1.6 TDI 115 MT', '2.0 TDI 150 DSG', '2.0 TDI 150 4x4'] },
            { name: 'Kamiq', subs: ['1.0 TSI 95 MT', '1.0 TSI 115 AT', '1.5 TSI 150 DSG', '1.6 TDI 115 MT'] },
        ]
    },

    {
        make: 'FIAT',
        models: [
            { name: 'Punto', subs: ['1.2 MT', '1.4 MT', '1.3 Multijet 75 MT', '1.3 Multijet 95 MT', '1.9 Multijet MT', 'Grande 1.9 Multijet', 'Sport 1.4 T-Jet'] },
            { name: 'Panda', subs: ['1.0 Mild Hybrid', '1.2 MT', '1.3 Multijet 75 MT', '4x4 0.9 TwinAir'] },
            { name: 'Tipo', subs: ['1.4 95 MT', '1.6 110 MT', '1.3 Multijet 95 MT', '1.6 Multijet 120 MT', '1.6 Multijet 120 AT', 'SW 1.6 Multijet', 'Cross 1.0 GSE'] },
            { name: 'Bravo', subs: ['1.4 T-Jet 120 MT', '1.4 T-Jet 150 MT', '1.6 Multijet 120 MT', '2.0 Multijet 165 MT'] },
            { name: 'Doblo', subs: ['1.4 MT', '1.3 Multijet 90 MT', '1.6 Multijet 105 MT', '2.0 Multijet 135 MT', 'Cargo 1.6 Multijet'] },
            { name: 'Ducato', subs: ['2.0 Multijet 110 MT', '2.3 Multijet 130 MT', '2.3 Multijet 150 AT', '3.0 Multijet 160 MT'] },
            { name: '500', subs: ['1.0 Mild Hybrid', '1.2 MT', '1.4 MT', '0.9 TwinAir 85 MT', '500e EV'] },
            { name: '500X', subs: ['1.0 T3 120 MT', '1.3 T4 150 AT', '1.6 Multijet 120 AT', '2.0 Multijet 140 AT 4x4'] },
        ]
    },

    // ════════════════════════════════════════════════════
    //  JAPANESE
    // ════════════════════════════════════════════════════
    {
        make: 'TOYOTA',
        models: [
            { name: 'Yaris', subs: ['1.0 VVT-i 72 MT', '1.5 VVT-i 111 MT', '1.5 VVT-i AT', '1.4 D-4D 90 MT', '1.5 Hybrid 100 AT', 'GR 1.6T MT'] },
            { name: 'Corolla', subs: ['1.2 Turbo 116 MT', '1.6 VVT-i 122 MT', '1.6 AT', '1.4 D-4D 90 MT', '1.8 Hybrid 122 CVT', '2.0 Hybrid 180 CVT', 'GR 1.8 MT', 'Touring Sports 1.8 Hybrid'] },
            { name: 'Auris', subs: ['1.2 Turbo 116 MT', '1.4 D-4D 90 MT', '1.6 MT', '1.8 Hybrid 136 CVT', 'Touring Sports 2.0 D-4D'] },
            { name: 'Avensis', subs: ['1.6 MT', '1.8 MT', '2.0 MT', '2.0 D-4D 126 MT', '2.2 D-4D 150 MT', '2.2 D-4D AT', 'SW 2.0 D-4D'] },
            { name: 'RAV4', subs: ['2.0 VVT-i MT', '2.0 VVT-i AT', '2.5 Hybrid AWD CVT', '2.0 D-4D MT', '2.2 D-4D MT', '2.5 PHEV AWD'] },
            { name: 'Land Cruiser', subs: ['2.8 D-4D AT', '3.0 D-4D AT', '4.0 V6 AT', '4.5 V8 D-4D AT', 'Prado 2.8 D-4D', 'Prado 2.7 VVT-i', 'GR Sport 2.8 D-4D'] },
            { name: 'HiAce', subs: ['2.5 D-4D MT', '2.5 D-4D AT', '2.8 D-4D AT', 'Commuter 2.8 D-4D'] },
            { name: 'HiLux', subs: ['2.4 D-4D MT 4x2', '2.4 D-4D MT 4x4', '2.8 D-4D AT 4x4', '2.8 GR Sport AT 4x4'] },
            { name: 'C-HR', subs: ['1.2 Turbo 116 MT', '1.8 Hybrid 122 CVT', '2.0 Hybrid 184 CVT'] },
            { name: 'ProAce', subs: ['1.5 D-4D 100 MT', '2.0 D-4D 120 MT', 'Verso 2.0 D-4D', 'City 1.5 D-4D'] },
        ]
    },

    {
        make: 'HONDA',
        models: [
            { name: 'Jazz', subs: ['1.2 i-VTEC MT', '1.3 i-VTEC AT', '1.5 i-MMD Hybrid', '1.5 i-DSI MT'] },
            { name: 'Civic', subs: ['1.0 VTEC Turbo 126 MT', '1.5 VTEC Turbo 182 CVT', '1.6 i-DTEC 120 MT', '2.0 i-VTEC MT', 'Type R 2.0T MT', 'e:HEV 2.0 Hybrid'] },
            { name: 'Accord', subs: ['1.5 VTEC Turbo AT', '2.0 i-VTEC AT', '2.2 i-CTDi MT', '2.4 AT', 'e:HEV 2.0 Hybrid'] },
            { name: 'CR-V', subs: ['1.5 VTEC Turbo AT', '2.0 i-VTEC AT', '2.0 i-MMD Hybrid AWD', '2.2 i-CTDi MT', '4WD 1.5T AT'] },
            { name: 'HR-V', subs: ['1.5 i-VTEC MT', '1.5 i-VTEC AT', 'e:HEV 1.5 Hybrid'] },
        ]
    },

    {
        make: 'NISSAN',
        models: [
            { name: 'Micra', subs: ['1.0 IG-T 100 MT', '1.0 IG-T 117 AT', '0.9 IG-T 90 MT', '1.5 dCi 90 MT'] },
            { name: 'Juke', subs: ['1.0 DIG-T 114 MT', '1.2 DIG-T 115 AT', '1.5 dCi 110 MT', '1.6 DIG-T 190 4WD', 'Nismo 1.6T'] },
            { name: 'Qashqai', subs: ['1.3 DIG-T 140 MT', '1.3 DIG-T 160 AT', '1.5 dCi 115 MT', '2.0 dCi 177 AT', 'e-Power 190 CVT', '1.2 DIG-T 115 MT'] },
            { name: 'X-Trail', subs: ['1.3 DIG-T 160 AT', '2.0 MT', '2.5 AT 4WD', '2.0 dCi AT', '1.6 dCi MT', 'e-Power 213 AWD'] },
            { name: 'Navara', subs: ['2.3 dCi 160 MT 4x2', '2.3 dCi 190 AT 4x4', '2.5 dCi MT 4x4', '2.5 MT 4x4 N-Guard'] },
            { name: 'Patrol', subs: ['4.0 V6 AT', '4.8 AT', '3.0 dCi AT', 'Y61 2.8 TD MT', 'Y61 3.0 TD MT'] },
            { name: 'Sunny', subs: ['1.5 MT', '1.6 MT', '1.5 AT', '1.6 AT'] },
            { name: 'Tiida', subs: ['1.5 MT', '1.6 MT', '1.8 AT', '1.5 AT'] },
        ]
    },

    {
        make: 'SUZUKI',
        models: [
            { name: 'Swift', subs: ['1.0 Boosterjet 111 MT', '1.2 DualJet 90 MT', '1.2 Hybrid MT', '1.3 MT', '1.6 Sport AT', '1.3 DDiS MT'] },
            { name: 'Vitara', subs: ['1.0 Boosterjet 111 MT', '1.4 Boosterjet 129 MT', '1.4 AT', '1.6 MT', '1.6 DDiS MT', '1.4 MHEV', 'AllGrip 1.4T 4WD'] },
            { name: 'Jimny', subs: ['1.3 MT 4WD', '1.3 AT 4WD', '1.5 MT 4WD', 'Pro 1.5 MT'] },
            { name: 'Baleno', subs: ['1.2 DualJet MT', '1.2 Hybrid MT', '1.3 MT', '1.3 AT'] },
            { name: 'S-Cross', subs: ['1.0 Boosterjet MT', '1.4 Boosterjet AT', '1.6 DDiS MT', '1.4 Hybrid AllGrip'] },
        ]
    },

    {
        make: 'MITSUBISHI',
        models: [
            { name: 'Lancer', subs: ['1.3 MT', '1.5 MT', '1.6 MT', '1.8 AT', '2.0 Turbo MT', 'Evolution X 2.0T'] },
            { name: 'Outlander', subs: ['2.0 MT', '2.4 CVT 4WD', '2.2 DI-D MT', '2.2 DI-D AT 4WD', 'PHEV 2.4 4WD', '3.0 V6 AT'] },
            { name: 'ASX', subs: ['1.6 MT', '2.0 AT', '1.8 DI-D MT', '2.2 DI-D AT', '1.3T AT'] },
            { name: 'L200', subs: ['2.4 DI-D MT 4x4', '2.4 DI-D AT 4x4', '2.5 DI-D MT 4x4', 'Club Cab 2.4 DI-D'] },
            { name: 'Pajero', subs: ['3.2 DI-D MT', '3.2 DI-D AT', '3.8 V6 AT', '3.5 V6 AT', 'Sport 2.4 DI-D'] },
            { name: 'Eclipse Cross', subs: ['1.5T MT', '1.5T AT', '2.4 PHEV 4WD'] },
        ]
    },

    // ════════════════════════════════════════════════════
    //  KOREAN
    // ════════════════════════════════════════════════════
    {
        make: 'HYUNDAI',
        models: [
            { name: 'i10', subs: ['1.0 MPI 67 MT', '1.0 MPI 67 AT', '1.2 MPI 87 MT', '1.2 MPI 87 AT'] },
            { name: 'i20', subs: ['1.0 T-GDI 100 MT', '1.0 T-GDI 120 AT', '1.2 MPI 84 MT', '1.4 MPI 100 MT', '1.4 CRDi 90 MT', '1.6 CRDi 115 MT', 'N Line 1.0T', 'N 1.6T'] },
            { name: 'i30', subs: ['1.0 T-GDI 120 MT', '1.4 T-GDI 140 DCT', '1.5 T-GDI 160 DCT', '1.6 CRDi 136 MT', '1.6 CRDi 136 DCT', 'N 2.0T', 'Fastback 1.4 T-GDI', 'SW 1.6 CRDi'] },
            { name: 'Tucson', subs: ['1.6 T-GDI 150 MT', '1.6 T-GDI 177 DCT', '2.0 MPi 156 AT', '1.6 CRDi 115 MT', '2.0 CRDi 185 AT', '1.6 T-GDI PHEV', 'N Line 1.6T'] },
            { name: 'Santa Fe', subs: ['2.0 MPi 155 AT', '2.5 MPi 190 AT', '2.0 CRDi 150 AT', '2.2 CRDi 200 AT 4WD', '1.6 T-GDI PHEV AWD', 'Premium 2.2 CRDi'] },
            { name: 'H1', subs: ['2.4 MPi MT', '2.4 MPi AT', '2.5 CRDi 136 MT', '2.5 CRDi 170 AT', 'Cargo 2.5 CRDi', 'Travel 2.5 CRDi'] },
            { name: 'Creta', subs: ['1.5 MPi MT', '1.5 MPi AT', '1.4 T-GDI DCT', '1.6 CRDi 115 MT', '1.6 CRDi 136 AT'] },
            { name: 'Sonata', subs: ['1.6 T-GDI AT', '2.0 MPi AT', '2.5 MPi AT', '2.0 HEV CVT'] },
            { name: 'Elantra', subs: ['1.6 MPi MT', '1.6 MPi AT', '2.0 MPi AT', '1.6 CRDi MT', '1.6 T-GDI DCT N Line'] },
        ]
    },

    {
        make: 'KIA',
        models: [
            { name: 'Picanto', subs: ['1.0 MPI 67 MT', '1.0 MPI 67 AT', '1.2 MPI 84 MT', '1.2 MPI 84 AT', 'GT Line 1.0T 100'] },
            { name: 'Rio', subs: ['1.0 T-GDI 100 MT', '1.0 T-GDI 120 DCT', '1.2 MPI 84 MT', '1.4 MPI 100 MT', '1.4 MPI AT', '1.4 CRDi 90 MT', '1.5 CRDi 115 MT', 'GT Line 1.0T'] },
            { name: 'Ceed', subs: ['1.0 T-GDI 120 MT', '1.4 T-GDI 140 DCT', '1.5 T-GDI 160 DCT', '1.6 CRDi 115 MT', '1.6 CRDi 136 DCT', 'SW 1.5 T-GDI', 'ProCeed 1.5 T-GDI', 'GT 1.6T'] },
            { name: 'Sportage', subs: ['1.6 T-GDI 150 MT', '1.6 T-GDI 177 DCT', '2.0 MPi 163 AT', '1.6 CRDi 115 MT', '2.0 CRDi 185 AT', '1.6 T-GDI HEV', '1.6 T-GDI PHEV', 'GT-Line 1.6 CRDi'] },
            { name: 'Sorento', subs: ['2.0 MPi AT', '2.5 MPi AT', '2.0 CRDi 150 AT', '2.2 CRDi 200 AT 4WD', '1.6 T-GDI HEV', '1.6 T-GDI PHEV AWD'] },
            { name: 'Stinger', subs: ['2.0 T-GDI 255 AT', '3.3 V6 T-GDI 366 AT AWD', 'GT 3.3 V6'] },
        ]
    },

    // ════════════════════════════════════════════════════
    //  CHINESE — PRIORITY BRANDS FOR ALGERIA
    // ════════════════════════════════════════════════════
    {
        make: 'CHERY',
        models: [
            { name: 'QQ', subs: ['0.8 MT', '1.0 MT', '1.1 MT'] },
            {
                name: 'Tiggo 2',
                subs: [
                    '1.5 MT Comfort', '1.5 AT Comfort',
                    '1.5T MT Luxury', '1.5T AT Luxury',
                    'Pro 1.5T AT',
                ]
            },
            {
                name: 'Tiggo 3',
                subs: [
                    '1.6 MT', '1.6 AT', '1.5T MT', '1.5T AT',
                    'Pro 1.5T AT Comfort', 'Pro 1.5T AT Luxury',
                ]
            },
            {
                name: 'Tiggo 4',
                subs: [
                    '1.5T MT Comfort', '1.5T AT Comfort',
                    '1.5T AT Luxury', 'Pro 1.5T AT',
                    'Pro PHEV',
                ]
            },
            {
                name: 'Tiggo 5X',
                subs: [
                    '1.5T MT Comfort', '1.5T AT Comfort', '1.5T AT Luxury',
                    'Pro 1.5T AT', 'Pro EV',
                ]
            },
            {
                name: 'Tiggo 7',
                subs: [
                    '1.5T MT Comfort', '1.5T AT Comfort', '1.6T AT Luxury',
                    '1.6T AT Flagship', 'Pro 1.5T AT',
                    'Pro PHEV 1.5T',
                ]
            },
            {
                name: 'Tiggo 8',
                subs: [
                    '1.5T AT 5-seat Comfort', '2.0T AT 5-seat Luxury',
                    '2.0T AT 7-seat Flagship',
                    'Pro 1.6T AT 7-seat', 'Pro Max 2.0T AT',
                    'PHEV 1.5T',
                    'Plus 2.0T AT',
                ]
            },
            {
                name: 'Arrizo 5',
                subs: [
                    '1.5 MT', '1.5 AT', '1.5T MT', '1.5T AT',
                    'Pro 1.5T AT Comfort', 'Pro 1.5T AT Luxury',
                    'e EV',
                ]
            },
            {
                name: 'Arrizo 6',
                subs: [
                    '1.5T MT Comfort', '1.5T AT Comfort',
                    '1.5T AT Luxury', '1.5T AT Flagship',
                    'Pro 1.6T AT',
                ]
            },
            {
                name: 'Arrizo 8',
                subs: [
                    '1.6T AT Comfort', '1.6T AT Luxury',
                    '2.0T AT Flagship',
                ]
            },
            { name: 'Omoda 5', subs: ['1.6T AT Comfort', '1.6T AT Luxury', '1.6T AT Flagship', 'EV Standard', 'EV Long Range'] },
            { name: 'Omoda C5', subs: ['1.6T AT', '1.6T AT Sport', 'EV'] },
        ]
    },

    {
        make: 'GEELY',
        models: [
            { name: 'Emgrand EC7', subs: ['1.5 MT', '1.5 AT', '1.8 MT', '1.8 AT'] },
            { name: 'Emgrand X7', subs: ['2.0 MT', '2.0 AT', '2.4 AT', 'Sport 2.0T AT'] },
            {
                name: 'Atlas',
                subs: [
                    '1.8T MT Comfort', '1.8T AT Comfort', '1.8T AT Luxury',
                    '2.4 AT', '2.0T AT Pro',
                ]
            },
            {
                name: 'Coolray',
                subs: [
                    '1.5T AT Comfort', '1.5T AT Luxury',
                    '1.5T AT Sport', '1.5T AT Flagship',
                ]
            },
            {
                name: 'Tugella',
                subs: [
                    '2.0T AT AWD Luxury', '2.0T AT AWD Flagship',
                ]
            },
            {
                name: 'Okavango',
                subs: [
                    '2.0T AT Comfort', '2.0T AT Luxury',
                    '2.0T AT Flagship', 'PHEV 2.0T AWD',
                ]
            },
            { name: 'Monjaro', subs: ['2.0T AT', '2.0T AWD Luxury', 'PHEV AWD'] },
            {
                name: 'Boyue',
                subs: [
                    '1.8T MT', '1.8T AT', '2.0T AT',
                    'Pro 2.0T AT Luxury',
                ]
            },
        ]
    },

    {
        make: 'HAVAL',
        models: [
            { name: 'H1', subs: ['1.5 MT Comfort', '1.5 AT Comfort', '1.5 AT Luxury'] },
            { name: 'H2', subs: ['1.5T MT Comfort', '1.5T AT Comfort', '1.5T AT Luxury'] },
            {
                name: 'H6',
                subs: [
                    '1.5T MT Comfort', '1.5T AT Comfort', '1.5T AT Luxury', '1.5T AT Flagship',
                    '2.0T AT Luxury', '2.0T AT Flagship',
                    '3rd Gen 1.5T DHT HEV', '3rd Gen 1.5T PHEV',
                ]
            },
            {
                name: 'H9',
                subs: [
                    '2.0T AT 4WD Comfort', '2.0T AT 4WD Luxury', '2.0T AT 4WD Flagship',
                    '3.0T V6 AT 4WD',
                ]
            },
            {
                name: 'Jolion',
                subs: [
                    '1.5T MT Comfort', '1.5T AT Comfort', '1.5T AT Luxury', '1.5T AT Flagship',
                    'HEV 1.5T Comfort', 'HEV 1.5T Luxury',
                    'PHEV 1.5T',
                ]
            },
            {
                name: 'Dargo',
                subs: [
                    '1.5T AT Comfort', '1.5T AT Luxury',
                    '2.0T AT Luxury 4WD', '2.0T AT Flagship 4WD',
                    'PHEV 1.5T 4WD',
                ]
            },
            { name: 'H5', subs: ['2.0T MT 4WD', '2.0T AT 4WD', 'Blue Label 2.0T'] },
        ]
    },

    {
        make: 'MG',
        models: [{
                name: 'MG3',
                subs: [
                    '1.5 MT Comfort', '1.5 AT Comfort', '1.5 AT Luxury',
                    'Hybrid+ 1.5T Comfort', 'Hybrid+ 1.5T Luxury',
                ]
            },
            {
                name: 'MG5',
                subs: [
                    '1.5T AT Comfort', '1.5T AT Luxury', '1.5T AT Trophy',
                    'EV Standard Range', 'EV Long Range',
                ]
            },
            {
                name: 'MG6',
                subs: [
                    '1.5T MT', '1.5T AT Comfort', '1.5T AT Luxury',
                    '1.5T DCT Trophy', '1.5T DCT X',
                ]
            },
            {
                name: 'ZS',
                subs: [
                    '1.0T MT', '1.0T AT Comfort', '1.0T AT Luxury', '1.5 AT',
                    'EV Comfort', 'EV Luxury', 'EV Long Range',
                    'HEV 1.5T',
                ]
            },
            {
                name: 'HS',
                subs: [
                    '1.5T AT Comfort', '1.5T AT Luxury', '1.5T AT Flagship',
                    '2.0T AT AWD Luxury', '2.0T AT AWD Flagship',
                    'PHEV 1.5T Luxury', 'PHEV 1.5T Flagship',
                    'Plus 1.5T AT',
                ]
            },
            { name: 'RX5', subs: ['1.5T AT Comfort', '1.5T AT Luxury', '2.0T AT Luxury', '2.0T AT Flagship', 'PHEV 2.0T'] },
            { name: 'MG4', subs: ['EV Standard 64kWh', 'EV Long Range 77kWh', 'EV XPOWER AWD'] },
            { name: 'Marvel R', subs: ['EV RWD 2WD', 'EV AWD Performance'] },
            { name: 'Extender', subs: ['1.5T MT 4x2', '1.9T AT 4x2', '2.0T AT 4x4'] },
        ]
    },

    {
        make: 'CHANGAN',
        models: [{
                name: 'CS35',
                subs: [
                    '1.6 MT', '1.6 AT', '1.4T MT', '1.4T AT',
                    'Plus 1.4T AT Comfort', 'Plus 1.4T AT Luxury',
                ]
            },
            {
                name: 'CS55',
                subs: [
                    '1.5T MT', '1.5T AT Comfort', '1.5T AT Luxury', '1.5T AT Flagship',
                    'Plus 1.5T AT Blue Whale',
                    'Plus EV',
                ]
            },
            {
                name: 'CS75',
                subs: [
                    '1.5T AT Comfort', '1.5T AT Luxury', '1.5T AT Flagship',
                    '2.0T AT AWD Luxury', '2.0T AT AWD Flagship',
                    'Plus 1.5T AT', 'PHEV 1.5T AWD',
                ]
            },
            {
                name: 'Alsvin',
                subs: [
                    '1.4 MT', '1.4 AT', '1.5T AT Comfort', '1.5T AT Luxury',
                ]
            },
            { name: 'Lamore', subs: ['1.5T AT Comfort', '1.5T AT Luxury'] },
            { name: 'UNI-T', subs: ['1.5T AT Comfort', '1.5T AT Luxury', '1.5T AT Flagship', 'Blue Whale 1.5T'] },
            { name: 'UNI-K', subs: ['2.0T AT Luxury', '2.0T AT Flagship', 'PHEV 1.5T AWD'] },
            { name: 'UNI-V', subs: ['1.5T AT Sport', '1.5T AT Luxury'] },
            { name: 'Hunter', subs: ['2.0T MT 4x4', '2.0T AT 4x4', 'Off-Road 2.0T 4WD'] },
        ]
    },

    {
        make: 'HAVAL',
        models: [] // already defined above — next entry is TANK (GWM sub-brand)
    },

    {
        make: 'GREAT WALL',
        models: [
            { name: 'Wingle 5', subs: ['2.0T MT 4x2', '2.0T MT 4x4', '2.5T MT 4x4', '2.5D MT 4x4'] },
            { name: 'Wingle 7', subs: ['2.0T MT 4x2', '2.0T AT 4x2', '2.0T MT 4x4', '2.0T AT 4x4'] },
            { name: 'Poer', subs: ['2.0T AT 4WD Standard', '2.0T AT 4WD Luxury', '2.0T AT 4WD Flagship'] },
            { name: 'Steed', subs: ['2.0T MT 4x2', '2.0T MT 4x4'] },
        ]
    },

    {
        make: 'JAC',
        models: [
            { name: 'J3', subs: ['1.3 MT', '1.5 AT'] },
            { name: 'J5', subs: ['1.5T MT', '1.5T AT', '1.8 MT'] },
            { name: 'S2', subs: ['1.5 MT Comfort', '1.5 AT Comfort', '1.5 AT Luxury'] },
            { name: 'S3', subs: ['1.5 MT', '1.5 AT', '1.3T AT Comfort', '1.3T AT Luxury'] },
            { name: 'S4', subs: ['1.5T MT Comfort', '1.5T AT Comfort', '1.5T AT Luxury'] },
            { name: 'S7', subs: ['2.0T AT Comfort', '2.0T AT Luxury', '2.0T AT Flagship'] },
            { name: 'T6', subs: ['2.0T MT 4x2', '2.0T MT 4x4', '2.8T MT 4x4', '2.0T AT 4x4'] },
            { name: 'iEV7s', subs: ['EV Standard', 'EV Long Range'] },
            { name: 'JS4', subs: ['1.5T AT Comfort', '1.5T AT Luxury', 'PHEV', 'EV'] },
        ]
    },

    {
        make: 'DFSK',
        models: [
            { name: 'Glory 330', subs: ['1.5 MT Comfort', '1.5 AT Comfort', '1.5 AT Luxury'] },
            { name: 'Glory 500', subs: ['1.5 MT', '1.5 AT Comfort', '1.5 AT Luxury'] },
            { name: 'Glory 580', subs: ['1.5T AT Comfort', '1.5T AT Luxury', '1.5T AT Flagship', 'Pro 1.5T'] },
            { name: 'Glory 560', subs: ['1.5T AT Comfort', '1.5T AT Luxury'] },
            { name: 'EC35', subs: ['EV Standard', 'EV Long Range'] },
            { name: 'EC31', subs: ['EV'] },
        ]
    },

    {
        make: 'BAIC',
        models: [
            { name: 'BJ20', subs: ['1.5T MT', '1.5T AT'] },
            {
                name: 'X35',
                subs: [
                    '1.5T MT Comfort', '1.5T AT Comfort', '1.5T AT Luxury',
                ]
            },
            {
                name: 'X55',
                subs: [
                    '1.5T AT Comfort', '1.5T AT Luxury', '1.5T AT Flagship',
                ]
            },
            { name: 'X7', subs: ['2.0T AT Luxury', '2.0T AT Flagship'] },
            {
                name: 'EU5',
                subs: [
                    'EV Standard 45kWh', 'EV Long Range 53kWh',
                ]
            },
            { name: 'EX360', subs: ['EV'] },
        ]
    },

    {
        make: 'DONGFENG',
        models: [
            { name: 'H30', subs: ['1.6 MT', '1.6 AT'] },
            {
                name: 'AX7',
                subs: [
                    '2.0T MT Comfort', '2.0T AT Comfort', '2.0T AT Luxury',
                ]
            },
            {
                name: 'AX4',
                subs: [
                    '1.5T MT', '1.5T AT Comfort', '1.5T AT Luxury',
                ]
            },
            { name: 'Rich 6', subs: ['2.0T MT 4x2', '2.0T AT 4x2', '2.0T MT 4x4'] },
            { name: 'Fengon 5', subs: ['1.5T AT Comfort', '1.5T AT Luxury'] },
            { name: 'Fengon 7', subs: ['2.0T AT Luxury', '2.0T AT Flagship'] },
        ]
    },

    {
        make: 'JETOUR',
        models: [{
                name: 'X70',
                subs: [
                    '1.5T MT Comfort', '1.5T AT Comfort', '1.5T AT Luxury', '1.5T AT Flagship',
                ]
            },
            {
                name: 'X70S',
                subs: [
                    '1.6T AT Comfort', '1.6T AT Luxury', '1.6T AT Flagship',
                ]
            },
            {
                name: 'X90',
                subs: [
                    '1.5T AT 7-seat Comfort', '1.5T AT 7-seat Luxury',
                    '2.0T AT 7-seat Flagship',
                ]
            },
            {
                name: 'X90 Plus',
                subs: [
                    '1.6T AT 7-seat', '1.6T PHEV AWD 7-seat',
                ]
            },
            { name: 'T2', subs: ['1.5T MT Comfort', '1.5T AT Comfort', '1.5T AT Luxury'] },
        ]
    },

    {
        make: 'BYD',
        models: [
            { name: 'F0', subs: ['1.0 MT'] },
            { name: 'F3', subs: ['1.5 MT', '1.5 AT', '1.6 MT', '1.6 AT'] },
            { name: 'F6', subs: ['2.0 MT', '2.0 AT', '2.4 AT'] },
            { name: 'Han', subs: ['EV RWD Standard 64kWh', 'EV RWD Long Range 77kWh', 'EV AWD 77kWh', 'DM-i 1.5T', 'DM-p 2.0T AWD'] },
            { name: 'Tang', subs: ['EV AWD 86kWh', 'DM-i 1.5T 7-seat', 'DM-p 2.0T AWD'] },
            { name: 'Song Plus', subs: ['DM-i 1.5T', 'DM-p 1.5T AWD', 'EV Standard', 'EV Long Range'] },
            { name: 'Song Pro', subs: ['1.5T AT', '1.5T DCT', 'DM-i 1.5T'] },
            { name: 'Atto 3', subs: ['EV Standard Range 49.9kWh', 'EV Long Range 60.5kWh'] },
            { name: 'Seal', subs: ['EV RWD Standard 61.4kWh', 'EV RWD Long Range 82.5kWh', 'EV AWD Performance 82.5kWh'] },
            { name: 'Dolphin', subs: ['EV Standard 38.9kWh', 'EV Long Range 60.4kWh', 'Boost 60.4kWh'] },
            { name: 'Yuan Plus', subs: ['EV Standard 49.9kWh', 'EV Long Range 60.5kWh'] },
        ]
    },

]

// ── Deduplicate HAVAL (double entry above) ─────────────────────────────────────
;
(function dedup() {
    var seen = {}
    var out = []
    SEED_DATA.forEach(function(entry) {
        if (!entry.models.length && seen[entry.make]) return // skip empty duplicate
        if (!seen[entry.make]) {
            seen[entry.make] = true;
            out.push(entry)
        } else {
            // merge models into first occurrence
            var first = out.find(function(e) { return e.make === entry.make })
            if (first) first.models = first.models.concat(entry.models)
        }
    })
    SEED_DATA.length = 0
    out.forEach(function(e) { SEED_DATA.push(e) })
})()


async function seedDatabase() {
    const existing = await get('SELECT COUNT(*) as cnt FROM makes')
    if (existing && existing.cnt > 0) {
        console.log('✅ Database already seeded (' + existing.cnt + ' makes)')
        return
    }

    console.log('🌱 Seeding database…')
    var totalModels = 0
    var totalSubs = 0

    for (var i = 0; i < SEED_DATA.length; i++) {
        var entry = SEED_DATA[i]
        var makeResult = await run(
            'INSERT OR IGNORE INTO makes(name, slug) VALUES(?,?)', [entry.make, entry.make.toLowerCase().replace(/\s+/g, '_')]
        )
        var makeId = makeResult.lastID ||
            (await get('SELECT id FROM makes WHERE name=?', [entry.make])).id

        for (var j = 0; j < entry.models.length; j++) {
            var modelEntry = entry.models[j]
            var modelResult = await run(
                'INSERT OR IGNORE INTO models(make_id, name, vehicle_type) VALUES(?,?,?)', [makeId, modelEntry.name, 'car']
            )
            var modelId = modelResult.lastID ||
                (await get('SELECT id FROM models WHERE make_id=? AND name=?', [makeId, modelEntry.name])).id

            totalModels++

            for (var k = 0; k < modelEntry.subs.length; k++) {
                await run(
                    'INSERT OR IGNORE INTO submodels(model_id, name) VALUES(?,?)', [modelId, modelEntry.subs[k]]
                )
                totalSubs++
            }
        }
    }

    console.log('✅ Seed complete: ' + SEED_DATA.length + ' makes, ' +
        totalModels + ' models, ' + totalSubs + ' submodels')
}

module.exports = { seedDatabase }