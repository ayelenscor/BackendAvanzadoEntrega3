import bcrypt from 'bcrypt';

const firstNames = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Patricia', 'Roberto', 'Sofia', 'Miguel', 'Laura'];
const lastNames = ['García', 'López', 'Rodríguez', 'Martínez', 'Pérez', 'González', 'Sánchez', 'Díaz', 'Ramirez', 'Torres'];
const roles = ['admin', 'user'];

const generateObjectId = () => {
    return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
};

const generateEmail = (firstName, lastName, index) => {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${domain}`;
};

const generatePastDate = () => {
    const days = Math.floor(Math.random() * 365);
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
};

export const generateMockUsers = async (quantity) => {
    if (!quantity || quantity <= 0) {
        return [];
    }
    const users = [];
    const hashedPassword = await bcrypt.hash('coder123', 10);
    for (let i = 0; i < quantity; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        users.push({
            _id: generateObjectId(),
            first_name: firstName,
            last_name: lastName,
            email: generateEmail(firstName, lastName, i),
            age: Math.floor(Math.random() * (80 - 18 + 1)) + 18,
            password: hashedPassword,
            role: roles[Math.floor(Math.random() * roles.length)],
            pets: [],
        });
    }
    return users;
};

export const generateMockPets = (quantity) => {
    if (!quantity || quantity <= 0) {
        return [];
    }

    const petNames = ['Max', 'Luna', 'Bella', 'Duke', 'Charlie', 'Lucy', 'Bailey', 'Rocky', 'Daisy', 'Buddy'];
    const breeds = ['Labrador', 'Golden Retriever', 'Bulldog', 'Poodle', 'Beagle', 'Dalmata', 'Pastor Alemán', 'Cocker Spaniel', 'Boxer', 'Husky'];
    const petTypes = ['dog', 'cat', 'bird', 'reptile', 'rabbit'];

    const pets = [];
    for (let i = 0; i < quantity; i++) {
        const petType = petTypes[Math.floor(Math.random() * petTypes.length)];
        const ownerFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ownerLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        pets.push({
            name: petNames[Math.floor(Math.random() * petNames.length)] + Math.floor(Math.random() * 100),
            type: petType,
            age: Math.floor(Math.random() * 20) + 1,
            breed: breeds[Math.floor(Math.random() * breeds.length)],
            owner: ownerFirstName + ' ' + ownerLastName,
        });
    }

    return pets;
};
