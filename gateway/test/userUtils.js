const firstMaleNameList = [
  "Aaron",
  "Adam",
  "Benjamin",
  "Christopher",
  "Daniel",
  "David",
  "Dewey",
  "Edward",
  "Ethan",
  "Harrison",
  "Harry",
  "Jacob",
  "Joshua",
  "Liam",
  "Michael",
  "Muhammad",
  "Oliver",
  "Richard",
  "Robert",
  "Thomas",
  "William",
];

const firstFemaleNameList = [
  "Abigail",
  "Amber",
  "Amelia",
  "Amy",
  "Anna",
  "Chloe",
  "Eleanor",
  "Elizabeth",
  "Ella",
  "Ellie",
  "Emma",
  "Florence",
  "Freya",
  "Holly",
  "Isabella",
  "Megan",
  "Millie",
  "Molly",
  "Rebecca",
  "Sarah",
  "Sophie",
];

const lastNameList = [
  "Adams",
  "Barnett",
  "Figueroa",
  "Fisher",
  "Foster",
  "Garcia",
  "Griffin",
  "Houghton",
  "Lawson",
  "Lee",
  "Mcgee",
  "Pena",
  "Perry",
  "Ramsey",
  "Richards",
  "Ross",
  "Russell",
  "Santos",
  "Stevens",
  "Townsend",
  "Whittle",
];

const locationList = [
  "Austin, Texas",
  "Boulder, Colorado",
  "Buffalo, New York",
  "Columbus, Ohio",
  "Jacksonville, Florida",
  "Omaha, Nebraska",
  "Portland, Oregon",
];

function _getRandomEntry(entryList) {
  const idx = Math.floor(Math.random() * entryList.length);
  return entryList[idx];
}

const makeCounter = () => {
  let count = 0;
  return () => {
    count += 1;
    return count;
  };
};

const phoneNumberCounter = makeCounter();

exports.generateUser = ({ gender = "FEMALE" }) => {
  let firstName;

  if (gender === "FEMALE") {
    firstName = _getRandomEntry(firstFemaleNameList);
  }

  if (gender === "MALE") {
    firstName = _getRandomEntry(firstMaleNameList);
  }

  const lastName = _getRandomEntry(lastNameList);

  const yearOfBirth = 1960 + Math.floor(Math.random() * 30);
  const monthOfBirth = 1 + Math.floor(Math.random() * 12);
  const dayOfBirth = 1 + Math.floor(Math.random() * 30);

  const location = _getRandomEntry(locationList);

  const randomNumber = Math.floor(Math.random() * 100);

  const emailPrefix1 = firstName.toLowerCase() + "." + lastName.toLowerCase();
  const emailPrefix2 = lastName.toLowerCase() + "." + firstName.toLowerCase();

  const username = emailPrefix1 + "." + randomNumber;
  const email = username + "@example.com";
  const emailSecondary = emailPrefix2 + "." + randomNumber + "@example.com";

  const phone = `${phoneNumberCounter()}`.padStart(10, "0");

  const bio =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const password = `${firstName}${lastName}123`;

  return {
    firstName,
    lastName,
    username,
    email,
    gender,
    yearOfBirth,
    monthOfBirth,
    dayOfBirth,
    location,
    emailSecondary,
    phone,
    bio,
    password,
  };
};
