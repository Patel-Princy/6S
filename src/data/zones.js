// src/data/zones.js

export const zonesData = [
  {
    id: "zone_1",
    name: "Zone 01 – Anviksha",
    head: "Prof. Devjani Banerjee",
    subZones: [
      { id: "z1_sz1", name: "Anviksha Ground Floor", coordinator: "Ms. Dulari Raj" },
      { id: "z1_sz2", name: "Anviksha First Floor", coordinator: "Ms. Deepti Davla" },
      { id: "z1_sz3", name: "Anviksha Second Floor", coordinator: "Mr. Kiran Parmar" },
      { id: "z1_sz4", name: "Anviksha Third Floor", coordinator: "Dr. Sankara Narayan" }
    ]
  },
  {
    id: "zone_2",
    name: "Zone 02 – School of Technology",
    head: "Dr. Sanjukta Bose Goswami",
    subZones: [
      { id: "z2_sz1", name: "Ground Floor - All Labs", coordinator: "Dr. Amit Singh" },
      { id: "z2_sz2", name: "Ground Floor - IT Room and SM-IT Office", coordinator: "Mr. Vishal Harith" },
      { id: "z2_sz3", name: "Ground Floor - Reading Room / Dean Office / Workshop / Open Area", coordinator: "Mr. Anup Upadhayay" },
      { id: "z2_sz4", name: "First Floor - Exam Control Office", coordinator: "Mr. Dhruv Prajapati" },
      { id: "z2_sz5", name: "First Floor - All Labs & Auditorium", coordinator: "Mr. Jayraj Kamlakar" },
      { id: "z2_sz6", name: "First Floor - Faculty Room / Classroom", coordinator: "Ms. Anuja Sundriyal" },
      { id: "z2_sz7", name: "Second Floor - Faculty Room", coordinator: "Dr. Rahul Sharma" },
      { id: "z2_sz8", name: "Second Floor - All Classrooms & IT Infra", coordinator: "Mr. Hemant Rajpoot" },
      { id: "z2_sz9", name: "Second Floor - General Infrastructure", coordinator: "Mr. Tanmay Naik" }
    ]
  },
  {
    id: "zone_3",
    name: "Zone 03 – Common Amenities",
    head: "Mr. Naren Acharya",
    subZones: [
      { id: "z3_sz1", name: "SOS to Anviksha Common Road", coordinator: "Ms. Dharti Patel" },
      { id: "z3_sz2", name: "Hang Out Area", coordinator: "Mr. Aadilmahedi Durvesh" },
      { id: "z3_sz3", name: "Aanganva", coordinator: "Ms. Sachiyanka Srivastava" },
      { id: "z3_sz4", name: "Sarjan", coordinator: "Ms. Dulari Raj" },
      { id: "z3_sz5", name: "Multi Purpose Court", coordinator: "Ms. Sabita P O" }
    ]
  },
  {
    id: "zone_4",
    name: "Zone 04 – Kasturba Gandhi Bhavan",
    head: "Dr. Abha Kalaiya",
    subZones: [
      { id: "z4_sz1", name: "Ground Floor & Outside Open Area", coordinator: "Dr. Chetna Parmar" },
      { id: "z4_sz2", name: "First Floor", coordinator: "Ms. Hetal Jethani" },
      { id: "z4_sz3", name: "Second Floor", coordinator: "Ms. Yoothika Patel" },
      { id: "z4_sz4", name: "Third Floor", coordinator: "Dr. Sindura Gudipatti" },
      { id: "z4_sz5", name: "Food Plex", coordinator: "Ms. Vimla Virparia" }
    ]
  },
  {
    id: "zone_5",
    name: "Zone 05 – Vikram Sarabhai Bhavan",
    head: "Dr. Mayankkumar Sharma",
    subZones: [
      { id: "z5_sz1", name: "Ground Floor including Parking and Garden", coordinator: "Dr. Bhaumik Machi" },
      { id: "z5_sz2", name: "First Floor", coordinator: "Mr. Mehul Chauhan" },
      { id: "z5_sz3", name: "Second Floor", coordinator: "Mr. Jay Jingar" }
    ]
  },
  {
    id: "zone_6",
    name: "Zone 06 – Swami Vivekananda Bhavan",
    head: "Dr. Akhilesh Prajapati",
    subZones: [
      { id: "z6_sz1", name: "Ground Floor & Outside Open Area", coordinator: "Dr. Niyam Dave" },
      { id: "z6_sz2", name: "First Floor", coordinator: "Dr. Parin Kanaiya" },
      { id: "z6_sz3", name: "Second Floor", coordinator: "Dr. Chandra Has" },
      { id: "z6_sz4", name: "Third Floor", coordinator: "Dr. Prasad Andhare" }
    ]
  },
  {
    id: "zone_7",
    name: "Zone 07 – FIREPLEX",
    head: "Mr. Srikrishnan",
    subZones: [
      { id: "z7_sz1", name: "Fire Drill Ground & Hydrant System", coordinator: "Mr. Bhavesh Patel" },
      { id: "z7_sz2", name: "Drill Tower & 7 Rooms", coordinator: "Mr. Priyank Parekh" }
    ]
  },
  {
    id: "zone_8",
    name: "Zone 08 – School of Science & Management",
    head: "Prof. Dr. Ranjita Banerjee",
    subZones: [
      { id: "z8_sz1", name: "Ground Floor", coordinator: "Ms. Neeshu Chaudhary" },
      { id: "z8_sz2", name: "First Floor", coordinator: "Dr. Prabal Sengupta" },
      { id: "z8_sz3", name: "Second Floor", coordinator: "Dr. Vidhita Sinha" },
      { id: "z8_sz4", name: "Outside Open Area Including Parking and Garden", coordinator: "Dr. Shilpa Gamit" }
    ]
  }
];

export const getSubZonesForZone = (zoneId) => {
  const zone = zonesData.find(z => z.id === zoneId);
  return zone ? zone.subZones : [];
};

export const getAllSubZones = () => {
  return zonesData.flatMap(z => z.subZones.map(sz => ({...sz, zoneId: z.id, zoneName: z.name})));
};
