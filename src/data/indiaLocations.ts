// Indian states with major cities and sample postal codes per city.
// Used for cascading LOVs in the address form.

export interface CityData {
  name: string;
  postalCodes: string[];
}

export interface StateData {
  name: string;
  cities: CityData[];
}

export const INDIA_STATES: StateData[] = [
  {
    name: "Andhra Pradesh",
    cities: [
      { name: "Visakhapatnam", postalCodes: ["530001", "530002", "530013", "530016"] },
      { name: "Vijayawada", postalCodes: ["520001", "520002", "520007", "520010"] },
      { name: "Guntur", postalCodes: ["522001", "522002", "522006"] },
      { name: "Tirupati", postalCodes: ["517501", "517502", "517507"] },
    ],
  },
  {
    name: "Arunachal Pradesh",
    cities: [
      { name: "Itanagar", postalCodes: ["791111", "791113"] },
      { name: "Naharlagun", postalCodes: ["791110"] },
    ],
  },
  {
    name: "Assam",
    cities: [
      { name: "Guwahati", postalCodes: ["781001", "781005", "781022", "781028"] },
      { name: "Dibrugarh", postalCodes: ["786001", "786003"] },
      { name: "Silchar", postalCodes: ["788001", "788005"] },
    ],
  },
  {
    name: "Bihar",
    cities: [
      { name: "Patna", postalCodes: ["800001", "800004", "800013", "800020"] },
      { name: "Gaya", postalCodes: ["823001", "823002"] },
      { name: "Bhagalpur", postalCodes: ["812001", "812002"] },
      { name: "Muzaffarpur", postalCodes: ["842001", "842002"] },
    ],
  },
  {
    name: "Chhattisgarh",
    cities: [
      { name: "Raipur", postalCodes: ["492001", "492004", "492010"] },
      { name: "Bhilai", postalCodes: ["490001", "490006"] },
      { name: "Bilaspur", postalCodes: ["495001", "495004"] },
    ],
  },
  {
    name: "Goa",
    cities: [
      { name: "Panaji", postalCodes: ["403001", "403002"] },
      { name: "Margao", postalCodes: ["403601", "403602"] },
      { name: "Vasco da Gama", postalCodes: ["403802", "403804"] },
    ],
  },
  {
    name: "Gujarat",
    cities: [
      { name: "Ahmedabad", postalCodes: ["380001", "380009", "380015", "380054"] },
      { name: "Surat", postalCodes: ["395001", "395003", "395007"] },
      { name: "Vadodara", postalCodes: ["390001", "390007", "390020"] },
      { name: "Rajkot", postalCodes: ["360001", "360005"] },
      { name: "Gandhinagar", postalCodes: ["382010", "382016"] },
    ],
  },
  {
    name: "Haryana",
    cities: [
      { name: "Gurugram", postalCodes: ["122001", "122002", "122018"] },
      { name: "Faridabad", postalCodes: ["121001", "121002", "121006"] },
      { name: "Panipat", postalCodes: ["132103", "132104"] },
      { name: "Karnal", postalCodes: ["132001", "132002"] },
    ],
  },
  {
    name: "Himachal Pradesh",
    cities: [
      { name: "Shimla", postalCodes: ["171001", "171002"] },
      { name: "Manali", postalCodes: ["175131"] },
      { name: "Dharamshala", postalCodes: ["176215", "176216"] },
    ],
  },
  {
    name: "Jharkhand",
    cities: [
      { name: "Ranchi", postalCodes: ["834001", "834002", "834008"] },
      { name: "Jamshedpur", postalCodes: ["831001", "831004"] },
      { name: "Dhanbad", postalCodes: ["826001", "826004"] },
    ],
  },
  {
    name: "Karnataka",
    cities: [
      { name: "Bengaluru", postalCodes: ["560001", "560034", "560066", "560078", "560100"] },
      { name: "Mysuru", postalCodes: ["570001", "570009"] },
      { name: "Mangaluru", postalCodes: ["575001", "575003"] },
      { name: "Hubballi", postalCodes: ["580020", "580029"] },
    ],
  },
  {
    name: "Kerala",
    cities: [
      { name: "Thiruvananthapuram", postalCodes: ["695001", "695010", "695014"] },
      { name: "Kochi", postalCodes: ["682001", "682017", "682025"] },
      { name: "Kozhikode", postalCodes: ["673001", "673002"] },
      { name: "Thrissur", postalCodes: ["680001", "680005"] },
    ],
  },
  {
    name: "Madhya Pradesh",
    cities: [
      { name: "Bhopal", postalCodes: ["462001", "462016", "462023"] },
      { name: "Indore", postalCodes: ["452001", "452010", "452016"] },
      { name: "Gwalior", postalCodes: ["474001", "474009"] },
      { name: "Jabalpur", postalCodes: ["482001", "482002"] },
    ],
  },
  {
    name: "Maharashtra",
    cities: [
      { name: "Mumbai", postalCodes: ["400001", "400050", "400070", "400072", "400103"] },
      { name: "Pune", postalCodes: ["411001", "411014", "411038", "411057"] },
      { name: "Nagpur", postalCodes: ["440001", "440010", "440022"] },
      { name: "Nashik", postalCodes: ["422001", "422005", "422011"] },
      { name: "Thane", postalCodes: ["400601", "400607"] },
    ],
  },
  {
    name: "Manipur",
    cities: [
      { name: "Imphal", postalCodes: ["795001", "795004"] },
    ],
  },
  {
    name: "Meghalaya",
    cities: [
      { name: "Shillong", postalCodes: ["793001", "793003"] },
    ],
  },
  {
    name: "Mizoram",
    cities: [
      { name: "Aizawl", postalCodes: ["796001", "796007"] },
    ],
  },
  {
    name: "Nagaland",
    cities: [
      { name: "Kohima", postalCodes: ["797001"] },
      { name: "Dimapur", postalCodes: ["797112"] },
    ],
  },
  {
    name: "Odisha",
    cities: [
      { name: "Bhubaneswar", postalCodes: ["751001", "751007", "751024"] },
      { name: "Cuttack", postalCodes: ["753001", "753008"] },
      { name: "Rourkela", postalCodes: ["769001", "769004"] },
    ],
  },
  {
    name: "Punjab",
    cities: [
      { name: "Ludhiana", postalCodes: ["141001", "141002", "141008"] },
      { name: "Amritsar", postalCodes: ["143001", "143005"] },
      { name: "Jalandhar", postalCodes: ["144001", "144003"] },
      { name: "Patiala", postalCodes: ["147001", "147003"] },
    ],
  },
  {
    name: "Rajasthan",
    cities: [
      { name: "Jaipur", postalCodes: ["302001", "302012", "302017", "302020"] },
      { name: "Jodhpur", postalCodes: ["342001", "342005"] },
      { name: "Udaipur", postalCodes: ["313001", "313002"] },
      { name: "Kota", postalCodes: ["324001", "324005"] },
    ],
  },
  {
    name: "Sikkim",
    cities: [
      { name: "Gangtok", postalCodes: ["737101", "737102"] },
    ],
  },
  {
    name: "Tamil Nadu",
    cities: [
      { name: "Chennai", postalCodes: ["600001", "600028", "600040", "600096", "600119"] },
      { name: "Coimbatore", postalCodes: ["641001", "641012", "641035"] },
      { name: "Madurai", postalCodes: ["625001", "625002", "625020"] },
      { name: "Tiruchirappalli", postalCodes: ["620001", "620018"] },
      { name: "Salem", postalCodes: ["636001", "636007"] },
    ],
  },
  {
    name: "Telangana",
    cities: [
      { name: "Hyderabad", postalCodes: ["500001", "500032", "500081", "500084"] },
      { name: "Warangal", postalCodes: ["506002", "506004"] },
      { name: "Nizamabad", postalCodes: ["503001", "503002"] },
    ],
  },
  {
    name: "Tripura",
    cities: [
      { name: "Agartala", postalCodes: ["799001", "799004"] },
    ],
  },
  {
    name: "Uttar Pradesh",
    cities: [
      { name: "Lucknow", postalCodes: ["226001", "226010", "226016", "226024"] },
      { name: "Kanpur", postalCodes: ["208001", "208012", "208017"] },
      { name: "Agra", postalCodes: ["282001", "282005"] },
      { name: "Varanasi", postalCodes: ["221001", "221005", "221010"] },
      { name: "Noida", postalCodes: ["201301", "201304", "201309"] },
      { name: "Ghaziabad", postalCodes: ["201001", "201009"] },
      { name: "Prayagraj", postalCodes: ["211001", "211003"] },
    ],
  },
  {
    name: "Uttarakhand",
    cities: [
      { name: "Dehradun", postalCodes: ["248001", "248006"] },
      { name: "Haridwar", postalCodes: ["249401", "249407"] },
      { name: "Nainital", postalCodes: ["263001", "263002"] },
    ],
  },
  {
    name: "West Bengal",
    cities: [
      { name: "Kolkata", postalCodes: ["700001", "700016", "700064", "700091"] },
      { name: "Howrah", postalCodes: ["711101", "711106"] },
      { name: "Durgapur", postalCodes: ["713201", "713205"] },
      { name: "Siliguri", postalCodes: ["734001", "734005"] },
    ],
  },
  {
    name: "Andaman and Nicobar Islands",
    cities: [{ name: "Port Blair", postalCodes: ["744101", "744102"] }],
  },
  {
    name: "Chandigarh",
    cities: [{ name: "Chandigarh", postalCodes: ["160001", "160017", "160022"] }],
  },
  {
    name: "Dadra and Nagar Haveli and Daman and Diu",
    cities: [
      { name: "Daman", postalCodes: ["396210"] },
      { name: "Silvassa", postalCodes: ["396230"] },
    ],
  },
  {
    name: "Delhi",
    cities: [
      { name: "New Delhi", postalCodes: ["110001", "110011", "110021"] },
      { name: "Dwarka", postalCodes: ["110075", "110078"] },
      { name: "Rohini", postalCodes: ["110085", "110089"] },
      { name: "Saket", postalCodes: ["110017", "110030"] },
    ],
  },
  {
    name: "Jammu and Kashmir",
    cities: [
      { name: "Srinagar", postalCodes: ["190001", "190004"] },
      { name: "Jammu", postalCodes: ["180001", "180004"] },
    ],
  },
  {
    name: "Ladakh",
    cities: [
      { name: "Leh", postalCodes: ["194101"] },
      { name: "Kargil", postalCodes: ["194103"] },
    ],
  },
  {
    name: "Lakshadweep",
    cities: [{ name: "Kavaratti", postalCodes: ["682555"] }],
  },
  {
    name: "Puducherry",
    cities: [{ name: "Puducherry", postalCodes: ["605001", "605008"] }],
  },
];
