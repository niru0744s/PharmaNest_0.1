const products= [
      {
        "name": "Paracetamol",
        "brand": "Dolo",
        "form": "Tablet",
        "strength": "500 mg",
        "price": 50,
        "category": "Medicines",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Analgesic & antipyretic for mild to moderate pain/fever."
      },
      {
    
        "name": "Azithromycin",
        "brand": "Azithral",
        "form": "Tablet",
        "strength": "500 mg",
        "price": 220,
        "category": "Medicines",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Macrole antibiotic for respiratory infections."
      },
      {
       
        "name": "Metformin",
        "brand": "Glucophage",
        "form": "Tablet",
        "strength": "500 mg",
        "price": 180,
        "category": "Medicines",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "First-line oral antiabetic for type 2 diabetes."
      },
      {
     
        "name": "Omeprazole",
        "brand": "Omez",
        "form": "Capsule",
        "strength": "20 mg",
        "price": 150,
        "category": "Medicines",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Proton-pump inhibitor for GERD and ulcers."
      },
      {
   
        "name": "Fluconazole",
        "brand": "Diflucan",
        "form": "Tablet",
        "strength": "150 mg",
        "price": 170,
        "category": "Medicines",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Antifungal for candiasis."
      },
      {
    
        "name": "Ibuprofen",
        "brand": "Brufen",
        "form": "Tablet",
        "strength": "400 mg",
        "price": 70,
        "category": "OTC Medicines",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "NSA for pain, inflammation, and fever."
      },
      {
  
        "name": "Cetirizine",
        "brand": "Zyrtec",
        "form": "Tablet",
        "strength": "10 mg",
        "price": 120,
        "category": "OTC Medicines",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Second-generation antihistamine for allergy relief."
      },
      {
    
        "name": "Levocetirizine",
        "brand": "Xyzal",
        "form": "Tablet",
        "strength": "5 mg",
        "price": 140,
        "category": "OTC Medicines",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Non-drowsy antihistamine for allergies."
      },
      {
     
        "name": "Loperame",
        "brand": "Imodium",
        "form": "Capsule",
        "strength": "2 mg",
        "price": 90,
        "category": "OTC Medicines",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Antiarrheal agent."
      },
      {
     
        "name": "Ranitine",
        "brand": "Zantac",
        "form": "Tablet",
        "strength": "150 mg",
        "price": 80,
        "category": "OTC Medicines",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "H₂ receptor antagonist for heartburn."
      },
      {
   
        "name": "Adhesive Bandage",
        "brand": "Band-A",
        "form": "Strip",
        "strength": "Standard",
        "price": 45,
        "category": "First A",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Sterile adhesive bandage for minor cuts and scrapes."
      },
      {
      
        "name": "Antiseptic Cream",
        "brand": "Savlon",
        "form": "Cream",
        "strength": "1% w/w",
        "price": 95,
        "category": "First A",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Topical antiseptic to prevent infection."
      },
      {
   
        "name": "Cotton Roll",
        "brand": "Generic",
        "form": "Cotton",
        "strength": "100 g",
        "price": 60,
        "category": "First A",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Medical-grade cotton roll for dressing wounds."
      },
      {
      
        "name": "Gauze Pads",
        "brand": "Generic",
        "form": "Pad",
        "strength": "10×10 cm",
        "price": 75,
        "category": "First A",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Sterile gauze pads for cleaning and covering wounds."
      },
      {
 
        "name": "Surgical Tape",
        "brand": "Generic",
        "form": "Roll",
        "strength": "1 inch",
        "price": 50,
        "category": "First A",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Hypoallergenic tape for securing dressings."
      },
      {
     
        "name": "Hand Sanitizer",
        "brand": "Dettol",
        "form": "Gel",
        "strength": "50 ml",
        "price": 120,
        "category": "Hygiene",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Kills 99.9% of germs without water."
      },
      {
      
        "name": "Liqu Soap",
        "brand": "Lifebuoy",
        "form": "Liqu",
        "strength": "250 ml",
        "price": 85,
        "category": "Hygiene",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Antibacterial handwash for daily use."
      },
      {
      
        "name": "Face Mask",
        "brand": "3M",
        "form": "Mask",
        "strength": "N95",
        "price": 200,
        "category": "Hygiene",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Respirator mask for particulate protection."
      },
      {
    
        "name": "Tissue Pack",
        "brand": "Kleenex",
        "form": "Pack",
        "strength": "100 sheets",
        "price": 60,
        "category": "Hygiene",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Soft facial tissues for daily use."
      },
      {
       
        "name": "Wet Wipes",
        "brand": "Pampers",
        "form": "Pack",
        "strength": "80 sheets",
        "price": 110,
        "category": "Hygiene",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Gentle wipes for hands and surfaces."
      },
      {
      
        "name": "Baby Wipes",
        "brand": "Pampers",
        "form": "Pack",
        "strength": "60 wipes",
        "price": 140,
        "category": "Baby Products",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Soft wipes for gentle baby care."
      },
      {
      
        "name": "Baby Diapers",
        "brand": "Pampers",
        "form": "Pack",
        "strength": "Size M – 32 pcs",
        "price": 400,
        "category": "Baby Products",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Ultra-absorbent diapers for infants."
      },
      {
     
        "name": "Baby Lotion",
        "brand": "Johnson's",
        "form": "Liqu",
        "strength": "200 ml",
        "price": 180,
        "category": "Baby Products",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Gentle moisturizing lotion for baby skin."
      },
      {
    
        "name": "Baby Oil",
        "brand": "Johnson's",
        "form": "Liqu",
        "strength": "100 ml",
        "price": 160,
        "category": "Baby Products",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Soothing oil for massage and skin care."
      },
      {
     
        "name": "Nasal Aspirator",
        "brand": "Chicco",
        "form": "Device",
        "strength": "Standard",
        "price": 250,
        "category": "Baby Products",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Gentle suction device for infant nasal passages."
      },
      {
        
        "name": "Multivitamin Syrup",
        "brand": "Becadexamin",
        "form": "Syrup",
        "strength": "250 ml",
        "price": 220,
        "category": "Supplements",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Broad-spectrum vitamins & minerals for general health."
      },
      {
      
        "name": "Vitamin D3",
        "brand": "Calcimax",
        "form": "Tablet",
        "strength": "60k IU",
        "price": 160,
        "category": "Supplements",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Supplement for bone health."
      },
      {
     
        "name": "Omega-3 Fish Oil",
        "brand": "Seven Seas",
        "form": "Capsule",
        "strength": "1000 mg",
        "price": 350,
        "category": "Supplements",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Cardiovascular and cognitive support."
      },
      {
     
        "name": "Zinc + Vitamin C",
        "brand": "C-Zee",
        "form": "Effervescent",
        "strength": "10 mg + 500 mg",
        "price": 120,
        "category": "Supplements",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Immune-support combo."
      },
      {
    
        "name": "Calcium + Magnesium",
        "brand": "Shelcal",
        "form": "Tablet",
        "strength": "500 mg + 50 mg",
        "price": 180,
        "category": "Supplements",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Bone & muscle support."
      },
      {
       
        "name": "Blood Glucose Test Kit",
        "brand": "Accu-Chek",
        "form": "Kit",
        "strength": "Standard",
        "price": 800,
        "category": "Test Kits",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Self-testing kit for blood sugar levels."
      },
      {
     
        "name": "Pregnancy Test Kit",
        "brand": "Clearblue",
        "form": "Kit",
        "strength": "Single-use",
        "price": 250,
        "category": "Test Kits",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Rap early pregnancy detection."
      },
      {
   
        "name": "COV-19 Rap Test",
        "brand": "Abbott",
        "form": "Kit",
        "strength": "Single-use",
        "price": 300,
        "category": "Test Kits",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Quick antigen test for SARS-CoV-2."
      },
      {
    
        "name": "HIV Self Test Kit",
        "brand": "OraQuick",
        "form": "Kit",
        "strength": "Single-use",
        "price": 950,
        "category": "Test Kits",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Confential home HIV testing."
      },
      {
   
        "name": "Cholesterol Test Kit",
        "brand": "CardioCheck",
        "form": "Kit",
        "strength": "Standard",
        "price": 650,
        "category": "Test Kits",
        "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiatoday.in%2Fhealth%2Fstory%2Franitidine-white-petrolatum-removed-from-essential-medicines-list-what-it-means-1999932-2022-09-13&psig=AOvVaw2WuH30xlxphx9wve_nF6Va&ust=1746555639191000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCFnfX4jI0DFQAAAAAdAAAAABAY",
        "description": "Home cholesterol monitoring kit."
      }
    ];
    
module.exports = {data:products};