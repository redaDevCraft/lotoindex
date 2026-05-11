const { run, get } = require('./db.js')

const SEED_DATA = [
    // ── European ──────────────────────────────────────────
    {
        make: 'PEUGEOT',
        models: [
            { name: '106', subs: ['1.0', '1.1', '1.4', '1.6 16V', '1.9 D', 'GTI'] },
            { name: '206', subs: ['1.1', '1.4', '1.6', '2.0 HDI', '1.9 D', 'CC', 'SW'] },
            { name: '207', subs: ['1.4', '1.6 VTI', '1.6 HDI', 'CC', 'SW'] },
            { name: '208', subs: ['1.0 PureTech', '1.2 PureTech', '1.6 HDI', 'e-208', 'GTI'] },
            { name: '301', subs: ['1.2 VTI', '1.6 VTI', '1.6 HDI', '1.6 BlueHDI'] },
            { name: '307', subs: ['1.4', '1.6', '2.0', '1.6 HDI', '2.0 HDI', 'SW', 'CC'] },
            { name: '308', subs: ['1.2 PureTech', '1.6 THP', '1.6 HDI', '2.0 HDI', 'SW', 'GT'] },
            { name: '3008', subs: ['1.2 PureTech', '1.6 THP', '1.6 BlueHDI', '2.0 BlueHDI', 'HYbrid4'] },
            { name: '5008', subs: ['1.2 PureTech', '1.6 THP', '1.6 BlueHDI', '2.0 BlueHDI'] },
            { name: '406', subs: ['1.6', '1.8', '2.0', '1.9 TD', '2.0 HDI', 'Coupé'] },
            { name: '407', subs: ['1.6 HDI', '2.0 HDI', '2.7 HDI', '2.0', '3.0 V6'] },
            { name: '508', subs: ['1.6 THP', '2.0 HDI', '1.6 BlueHDI', '2.0 BlueHDI', 'RXH', 'SW'] },
            { name: 'Partner', subs: ['1.4', '1.6', '1.6 HDI', '1.9 D'] },
            { name: 'Expert', subs: ['1.6 HDI', '2.0 HDI', '2.0 BlueHDI'] },
            { name: 'Boxer', subs: ['2.0 HDI', '2.2 HDI', '3.0 HDI'] },
        ]
    },
    {
        make: 'RENAULT',
        models: [
            { name: 'Clio', subs: ['1.0 SCe', '1.2', '1.4', '1.6', '1.5 dCi', '1.9 D', 'RS', 'IV', 'V'] },
            { name: 'Megane', subs: ['1.4', '1.6', '2.0', '1.5 dCi', '1.9 dCi', 'RS', 'CC', 'SW', 'IV'] },
            { name: 'Scenic', subs: ['1.4', '1.6', '2.0', '1.5 dCi', '1.9 dCi', 'Grand Scenic'] },
            { name: 'Laguna', subs: ['1.6', '1.8', '2.0', '1.9 dCi', '2.0 dCi', 'III', 'Coupé'] },
            { name: 'Kangoo', subs: ['1.2', '1.4', '1.6', '1.5 dCi', '1.9 D', 'Z.E.'] },
            { name: 'Trafic', subs: ['1.9 dCi', '2.0 dCi', '2.5 dCi'] },
            { name: 'Master', subs: ['2.3 dCi', '2.5 dCi', '3.0 dCi'] },
            { name: 'Symbol', subs: ['1.2', '1.4', '1.6', '1.5 dCi'] },
            { name: 'Logan', subs: ['1.0 SCe', '1.2', '1.4', '1.6', '1.5 dCi', 'MCV'] },
            { name: 'Sandero', subs: ['1.0 SCe', '1.2', '1.5 dCi', 'Stepway', 'RS'] },
            { name: 'Duster', subs: ['1.2 TCe', '1.6', '2.0', '1.5 dCi', '4x4'] },
            { name: 'Captur', subs: ['0.9 TCe', '1.2 TCe', '1.5 dCi', 'E-Tech'] },
            { name: 'Kadjar', subs: ['1.2 TCe', '1.6 TCe', '1.5 dCi', '1.6 dCi'] },
            { name: 'Koleos', subs: ['2.0', '2.5', '2.0 dCi', '4x4'] },
            { name: 'Fluence', subs: ['1.5 dCi', '1.6', '2.0', 'Z.E.'] },
            { name: 'Talisman', subs: ['1.3 TCe', '1.6 TCe', '1.5 dCi', '1.6 dCi'] },
        ]
    },
    {
        make: 'CITROEN',
        models: [
            { name: 'C1', subs: ['1.0', '1.2 PureTech', '1.4 HDI'] },
            { name: 'C2', subs: ['1.1', '1.4', '1.6', '1.4 HDI', '1.6 HDI'] },
            { name: 'C3', subs: ['1.0 PureTech', '1.2 PureTech', '1.4', '1.6', '1.4 HDI', '1.6 HDI'] },
            { name: 'C4', subs: ['1.2 PureTech', '1.4', '1.6', '1.6 HDI', '2.0 HDI', 'Cactus', 'Picasso'] },
            { name: 'C5', subs: ['1.6', '1.8', '2.0', '1.6 HDI', '2.0 HDI', '2.7 HDI', 'X7'] },
            { name: 'C8', subs: ['2.0', '2.2', '2.0 HDI', '2.2 HDI'] },
            { name: 'Berlingo', subs: ['1.2 PureTech', '1.6', '1.5 BlueHDI', '1.6 HDI'] },
            { name: 'Jumpy', subs: ['1.6 HDI', '2.0 HDI', '2.0 BlueHDI'] },
            { name: 'Jumper', subs: ['2.0 HDI', '2.2 HDI', '3.0 HDI'] },
            { name: 'Dispatch', subs: ['1.6 HDI', '2.0 HDI'] },
            { name: 'Xsara', subs: ['1.4', '1.6', '1.9 D', '2.0 HDI', 'Picasso'] },
        ]
    },
    {
        make: 'VOLKSWAGEN',
        models: [
            { name: 'Golf', subs: ['1.0 TSI', '1.4 TSI', '1.6 TDI', '2.0 TDI', '2.0 GTI', 'R', 'Plus', 'SW'] },
            { name: 'Polo', subs: ['1.0', '1.2', '1.4', '1.6 TDI', '1.2 TSI', 'GTI'] },
            { name: 'Passat', subs: ['1.4 TSI', '1.6 TDI', '2.0 TDI', '2.0 TSI', 'Variant', 'Alltrack'] },
            { name: 'Tiguan', subs: ['1.4 TSI', '2.0 TSI', '1.6 TDI', '2.0 TDI', 'Allspace'] },
            { name: 'Touareg', subs: ['2.0 TSI', '3.0 TSI', '3.0 TDI', 'Hybrid'] },
            { name: 'Caddy', subs: ['1.2 TSI', '1.4', '1.6 TDI', '2.0 TDI', 'Maxi'] },
            { name: 'Transporter', subs: ['1.9 TDI', '2.0 TDI', '2.5 TDI', 'T5', 'T6'] },
            { name: 'Crafter', subs: ['2.0 TDI', '2.5 TDI'] },
        ]
    },
    {
        make: 'FIAT',
        models: [
            { name: 'Punto', subs: ['1.2', '1.4', '1.6', '1.3 Multijet', '1.9 Multijet', 'Grande'] },
            { name: 'Panda', subs: ['1.0 Hybrid', '1.2', '1.3 Multijet', '4x4'] },
            { name: 'Tipo', subs: ['1.4', '1.6', '1.3 Multijet', '1.6 Multijet', 'SW'] },
            { name: 'Bravo', subs: ['1.4 T-Jet', '1.6 Multijet', '2.0 Multijet'] },
            { name: 'Doblo', subs: ['1.2', '1.4', '1.3 Multijet', '1.6 Multijet', '2.0 Multijet', 'Cargo'] },
            { name: 'Ducato', subs: ['2.0 Multijet', '2.3 Multijet', '3.0 Multijet'] },
            { name: 'Scudo', subs: ['1.6 Multijet', '2.0 Multijet'] },
            { name: '500', subs: ['1.0 Hybrid', '1.2', '1.4', '0.9 TwinAir', '500e'] },
        ]
    },
    {
        make: 'OPEL',
        models: [
            { name: 'Corsa', subs: ['1.0', '1.2', '1.4', '1.3 CDTI', '1.7 CDTI', 'OPC', 'e-Corsa'] },
            { name: 'Astra', subs: ['1.2 Turbo', '1.4 Turbo', '1.6 CDTI', '2.0 CDTI', 'Sports Tourer', 'GTC'] },
            { name: 'Insignia', subs: ['1.4 Turbo', '1.6 CDTI', '2.0 CDTI', '2.8 OPC', 'Grand Sport', 'SW'] },
            { name: 'Zafira', subs: ['1.4 Turbo', '1.6 CDTI', '2.0 CDTI', 'Tourer'] },
            { name: 'Mokka', subs: ['1.4 Turbo', '1.6 CDTI', '1.2 Turbo', 'e-Mokka'] },
            { name: 'Vivaro', subs: ['1.6 CDTI', '2.0 CDTI', 'Combi'] },
            { name: 'Movano', subs: ['2.3 CDTI', '2.5 CDTI'] },
        ]
    },
    {
        make: 'BMW',
        models: [
            { name: 'Série 1', subs: ['116i', '118i', '120i', '116d', '118d', '120d', '125i', '130i', 'M135i'] },
            { name: 'Série 3', subs: ['316i', '318i', '320i', '325i', '316d', '318d', '320d', '325d', '330d', 'M3'] },
            { name: 'Série 5', subs: ['520i', '523i', '525i', '530i', '520d', '525d', '530d', '535d', 'M5'] },
            { name: 'X1', subs: ['sDrive18i', 'xDrive20i', 'sDrive18d', 'xDrive20d', 'xDrive25d'] },
            { name: 'X3', subs: ['xDrive20i', 'xDrive28i', 'xDrive20d', 'xDrive30d', 'M40i'] },
            { name: 'X5', subs: ['xDrive30i', 'xDrive40i', 'xDrive30d', 'xDrive40d', 'M50d'] },
        ]
    },
    {
        make: 'MERCEDES',
        models: [
            { name: 'Classe A', subs: ['A160', 'A180', 'A200', 'A180d', 'A200d', 'A35 AMG', 'A45 AMG'] },
            { name: 'Classe C', subs: ['C180', 'C200', 'C220d', 'C250', 'C300', 'C43 AMG', 'C63 AMG', 'SW'] },
            { name: 'Classe E', subs: ['E200', 'E220d', 'E250', 'E300', 'E350d', 'E43 AMG', 'E63 AMG', 'SW'] },
            { name: 'GLC', subs: ['GLC200', 'GLC220d', 'GLC250', 'GLC300', 'GLC43 AMG', 'Coupé'] },
            { name: 'Sprinter', subs: ['213 CDI', '216 CDI', '313 CDI', '316 CDI', '416 CDI', '516 CDI'] },
            { name: 'Vito', subs: ['109 CDI', '111 CDI', '114 CDI', '116 CDI', 'Tourer'] },
        ]
    },
    {
        make: 'AUDI',
        models: [
            { name: 'A1', subs: ['1.0 TFSI', '1.4 TFSI', '1.2 TFSI', '1.6 TDI', '1.8 TFSI', 'S1'] },
            { name: 'A3', subs: ['1.0 TFSI', '1.2 TFSI', '1.4 TFSI', '1.6 TDI', '2.0 TDI', 'S3', 'RS3', 'Sportback'] },
            { name: 'A4', subs: ['1.4 TFSI', '2.0 TFSI', '1.8 TFSI', '2.0 TDI', '3.0 TDI', 'S4', 'RS4', 'Avant'] },
            { name: 'Q3', subs: ['1.4 TFSI', '2.0 TFSI', '1.6 TDI', '2.0 TDI', 'RS Q3'] },
            { name: 'Q5', subs: ['2.0 TFSI', '3.0 TFSI', '2.0 TDI', '3.0 TDI', 'SQ5'] },
        ]
    },
    {
        make: 'SEAT',
        models: [
            { name: 'Ibiza', subs: ['1.0 MPI', '1.0 TSI', '1.2 TSI', '1.4 TDI', '1.6 TDI', 'FR', 'Cupra'] },
            { name: 'Leon', subs: ['1.0 TSI', '1.4 TSI', '1.5 TSI', '1.6 TDI', '2.0 TDI', 'FR', 'Cupra', 'ST'] },
            { name: 'Ateca', subs: ['1.0 TSI', '1.4 TSI', '1.5 TSI', '1.6 TDI', '2.0 TDI', 'FR', 'Cupra'] },
            { name: 'Alhambra', subs: ['1.4 TSI', '2.0 TSI', '1.6 TDI', '2.0 TDI'] },
        ]
    },
    {
        make: 'SKODA',
        models: [
            { name: 'Fabia', subs: ['1.0 MPI', '1.0 TSI', '1.2 TSI', '1.4 TDI', '1.6 TDI', 'RS'] },
            { name: 'Octavia', subs: ['1.0 TSI', '1.4 TSI', '1.5 TSI', '1.6 TDI', '2.0 TDI', 'RS', 'Scout', 'Combi'] },
            { name: 'Superb', subs: ['1.4 TSI', '1.8 TSI', '2.0 TSI', '1.6 TDI', '2.0 TDI', 'Combi'] },
            { name: 'Kodiaq', subs: ['1.4 TSI', '2.0 TSI', '1.6 TDI', '2.0 TDI', 'RS'] },
            { name: 'Karoq', subs: ['1.0 TSI', '1.5 TSI', '1.6 TDI', '2.0 TDI'] },
        ]
    },
    {
        make: 'TOYOTA',
        models: [
            { name: 'Yaris', subs: ['1.0 VVT-i', '1.5 VVT-i', '1.4 D-4D', '1.5 Hybrid', 'GR'] },
            { name: 'Corolla', subs: ['1.2 Turbo', '1.6 VVT-i', '1.4 D-4D', '1.8 Hybrid', '2.0 Hybrid', 'GR'] },
            { name: 'Auris', subs: ['1.2 Turbo', '1.4 D-4D', '1.6', '1.8 Hybrid', 'Touring Sports'] },
            { name: 'Avensis', subs: ['1.6', '1.8', '2.0', '2.0 D-4D', '2.2 D-4D', 'SW'] },
            { name: 'RAV4', subs: ['2.0 VVT-i', '2.5 Hybrid', '2.0 D-4D', '2.2 D-4D', '4x4'] },
            { name: 'ProAce', subs: ['1.6 D-4D', '2.0 D-4D', 'Verso', 'City'] },
            { name: 'HiAce', subs: ['2.5 D-4D', '2.8 D-4D'] },
            { name: 'Land Cruiser', subs: ['2.8 D-4D', '3.0 D-4D', '4.5 V8 D-4D', 'Prado'] },
        ]
    },
    {
        make: 'HYUNDAI',
        models: [
            { name: 'i10', subs: ['1.0 MPI', '1.2 MPI'] },
            { name: 'i20', subs: ['1.0 T-GDI', '1.2 MPI', '1.4 CRDi', 'N Line', 'N'] },
            { name: 'i30', subs: ['1.0 T-GDI', '1.4 T-GDI', '1.6 CRDi', '2.0 T-GDI N', 'SW', 'Fastback'] },
            { name: 'Tucson', subs: ['1.6 T-GDI', '2.0 MPi', '1.6 CRDi', '2.0 CRDi', 'PHEV'] },
            { name: 'Santa Fe', subs: ['2.0 MPi', '2.5 MPi', '2.0 CRDi', '2.2 CRDi', 'PHEV'] },
            { name: 'H1', subs: ['2.4 MPi', '2.5 CRDi', 'Cargo', 'Travel'] },
        ]
    },
    {
        make: 'KIA',
        models: [
            { name: 'Picanto', subs: ['1.0 MPI', '1.2 MPI', 'GT Line'] },
            { name: 'Rio', subs: ['1.0 T-GDI', '1.2 MPI', '1.4 MPI', '1.4 CRDi', 'GT Line'] },
            { name: 'Ceed', subs: ['1.0 T-GDI', '1.4 T-GDI', '1.6 CRDi', '1.4 CRDi', 'SW', 'ProCeed'] },
            { name: 'Sportage', subs: ['1.6 T-GDI', '2.0 MPi', '1.6 CRDi', '2.0 CRDi', 'HEV', 'PHEV'] },
            { name: 'Sorento', subs: ['2.0 MPi', '2.5 MPi', '2.0 CRDi', '2.2 CRDi', 'HEV', 'PHEV'] },
        ]
    },
    // ── Chinese ───────────────────────────────────────────
    {
        make: 'BYD',
        models: [
            { name: 'F0', subs: ['1.0 VVT', '1.0 MT', '1.0 AT'] },
            { name: 'F3', subs: ['1.5 MT', '1.5 AT', '1.6 MT', '1.6 AT'] },
            { name: 'F6', subs: ['2.0 MT', '2.0 AT', '2.4 MT', '2.4 AT'] },
            { name: 'Han', subs: ['EV', 'DM', 'DM-i', 'DM-p'] },
            { name: 'Tang', subs: ['EV', 'DM', 'DM-i', '2.0T AWD'] },
            { name: 'Song', subs: ['1.5T MT', '1.5T AT', 'EV', 'DM', 'DM-i', 'Plus'] },
            { name: 'Atto 3', subs: ['Standard Range', 'Extended Range'] },
            { name: 'Seal', subs: ['RWD Standard', 'RWD Long Range', 'AWD Performance'] },
            { name: 'Dolphin', subs: ['Standard Range', 'Extended Range', 'Boost'] },
        ]
    },
    {
        make: 'CHERY',
        models: [
            { name: 'QQ', subs: ['1.0 MT', '0.8 MT'] },
            { name: 'Tiggo 3', subs: ['1.6 MT', '1.6 AT', '1.5T MT', '1.5T AT'] },
            { name: 'Tiggo 5', subs: ['2.0 MT', '2.0 AT', '1.5T MT', '1.5T AT'] },
            { name: 'Tiggo 7', subs: ['1.5T MT', '1.5T AT', '1.6T AT', 'Pro'] },
            { name: 'Tiggo 8', subs: ['1.5T AT', '2.0T AT', 'Pro', 'PHEV', 'Plus'] },
            { name: 'Arrizo 5', subs: ['1.5 MT', '1.5 AT', '1.5T MT', '1.5T AT', 'e'] },
            { name: 'Arrizo 6', subs: ['1.5T MT', '1.5T AT', 'Pro'] },
        ]
    },
    {
        make: 'GEELY',
        models: [
            { name: 'Emgrand EC7', subs: ['1.5 MT', '1.5 AT', '1.8 MT', '1.8 AT'] },
            { name: 'Emgrand X7', subs: ['2.0 MT', '2.0 AT', '2.4 AT', 'Sport'] },
            { name: 'Atlas', subs: ['1.8T MT', '1.8T AT', '2.4 AT'] },
            { name: 'Coolray', subs: ['1.5T AT', 'Sport'] },
            { name: 'Tugella', subs: ['2.0T AT 4WD'] },
            { name: 'Okavango', subs: ['2.0T AT', 'PHEV'] },
        ]
    },
    {
        make: 'HAVAL',
        models: [
            { name: 'H1', subs: ['1.5 MT', '1.5 AT'] },
            { name: 'H2', subs: ['1.5T MT', '1.5T AT'] },
            { name: 'H6', subs: ['1.5T MT', '1.5T AT', '2.0T AT', '3rd Gen', 'HEV'] },
            { name: 'H9', subs: ['2.0T AT 4WD', '3.0T AT 4WD'] },
            { name: 'Jolion', subs: ['1.5T MT', '1.5T AT', 'HEV', 'PHEV'] },
            { name: 'Dargo', subs: ['1.5T AT', '2.0T AT', 'PHEV'] },
        ]
    },
    {
        make: 'MG',
        models: [
            { name: 'MG3', subs: ['1.5 MT', '1.5 AT', 'Hybrid+'] },
            { name: 'MG5', subs: ['1.5T AT', 'EV Standard', 'EV Long Range'] },
            { name: 'MG6', subs: ['1.5T MT', '1.5T AT', 'Trophy'] },
            { name: 'ZS', subs: ['1.0T MT', '1.0T AT', '1.5 AT', 'EV', 'HEV'] },
            { name: 'HS', subs: ['1.5T AT', '2.0T AT', 'PHEV', 'Plus'] },
            { name: 'RX5', subs: ['1.5T AT', '2.0T AT', 'PHEV'] },
            { name: 'Marvel R', subs: ['RWD', 'AWD Performance'] },
        ]
    },
    {
        make: 'CHANGAN',
        models: [
            { name: 'CS35', subs: ['1.6 MT', '1.6 AT', '1.4T MT', '1.4T AT', 'Plus'] },
            { name: 'CS55', subs: ['1.5T MT', '1.5T AT', 'Plus', 'Blue Whale'] },
            { name: 'CS75', subs: ['1.5T AT', '2.0T AT', 'Plus', 'PHEV'] },
            { name: 'Alsvin', subs: ['1.4 MT', '1.4 AT', '1.5T AT'] },
            { name: 'Eado', subs: ['1.4T AT', 'EV', 'Plus'] },
            { name: 'UNI-T', subs: ['1.5T AT', 'Blue Whale'] },
            { name: 'UNI-K', subs: ['2.0T AT', 'PHEV'] },
        ]
    },
    {
        make: 'GREAT WALL',
        models: [
            { name: 'Wingle 5', subs: ['2.0T MT 4x2', '2.0T MT 4x4', '2.5T MT 4x4'] },
            { name: 'Wingle 7', subs: ['2.0T AT 4x2', '2.0T AT 4x4'] },
            { name: 'Poer', subs: ['2.0T AT 4x4'] },
        ]
    },
    {
        make: 'JAC',
        models: [
            { name: 'J3', subs: ['1.3 MT', '1.5 AT'] },
            { name: 'J5', subs: ['1.5T MT', '1.5T AT', '1.8 MT'] },
            { name: 'S2', subs: ['1.5 MT', '1.5 AT'] },
            { name: 'S3', subs: ['1.5 MT', '1.5 AT', '1.3T AT'] },
            { name: 'S4', subs: ['1.5T MT', '1.5T AT'] },
            { name: 'T6', subs: ['2.0T MT 4x2', '2.0T MT 4x4', '2.8T MT 4x4'] },
            { name: 'iEV7s', subs: ['EV Standard', 'EV Long Range'] },
        ]
    },
    {
        make: 'DFSK',
        models: [
            { name: 'Glory 500', subs: ['1.5 MT', '1.5 AT'] },
            { name: 'Glory 580', subs: ['1.5T MT', '1.5T AT', 'Pro'] },
            { name: 'Glory 330', subs: ['1.5 MT', '1.5 AT'] },
            { name: 'EC35', subs: ['EV'] },
        ]
    },
]

async function seedDatabase() {
    // Check if already seeded
    const existing = await get('SELECT COUNT(*) as cnt FROM makes')
    if (existing && existing.cnt > 0) {
        console.log('✅ Database already seeded (' + existing.cnt + ' makes)')
        return
    }

    console.log('🌱 Seeding database...')
    let totalModels = 0
    let totalSubs = 0

    for (const entry of SEED_DATA) {
        // Insert make
        const makeResult = await run(
            'INSERT OR IGNORE INTO makes(name, slug) VALUES(?,?)', [entry.make, entry.make.toLowerCase().replace(/\s+/g, '_')]
        )
        const makeId = makeResult.lastID ||
            (await get('SELECT id FROM makes WHERE name=?', [entry.make])).id

        for (const modelEntry of entry.models) {
            // Insert model
            const modelResult = await run(
                'INSERT OR IGNORE INTO models(make_id, name, vehicle_type) VALUES(?,?,?)', [makeId, modelEntry.name, 'car']
            )
            const modelId = modelResult.lastID ||
                (await get('SELECT id FROM models WHERE make_id=? AND name=?', [makeId, modelEntry.name])).id

            totalModels++

            // Insert submodels
            for (const subName of modelEntry.subs) {
                await run(
                    'INSERT OR IGNORE INTO submodels(model_id, name) VALUES(?,?)', [modelId, subName]
                )
                totalSubs++
            }
        }
    }

    console.log('✅ Seed complete: ' + SEED_DATA.length + ' makes, ' +
        totalModels + ' models, ' + totalSubs + ' submodels')
}

module.exports = { seedDatabase }