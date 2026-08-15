const mongoose = require("mongoose");
require("dotenv").config();

const Tutor = require("../src/models/Tutor");

const tutors = [
    {
        name: "Rahul Sharma",
        email: "rahul.sharma@edubridge.demo",
        qualification: "B.Tech CSE",
        subjects: ["Mathematics", "Physics"],
        classes: ["9", "10", "11", "12", "JEE"],
        languages: ["Hindi", "English"],
        hourlyRate: 300,
        experience: 4,
        rating: 4.8,
        isVerified: true,
        isOnline: true,
        availability: ["Morning", "Evening"],
        bio: "Experienced tutor specializing in Mathematics and Physics."
    },
    {
        name: "Priya Verma",
        email: "priya.verma@edubridge.demo",
        qualification: "M.Sc Chemistry",
        subjects: ["Chemistry"],
        classes: ["11", "12", "JEE", "NEET"],
        languages: ["Hindi", "English"],
        hourlyRate: 400,
        experience: 5,
        rating: 4.9,
        isVerified: true,
        isOnline: true,
        availability: ["Evening", "Night"],
        bio: "Chemistry tutor focused on competitive exam preparation."
    },
    {
        name: "Aman Gupta",
        email: "aman.gupta@edubridge.demo",
        qualification: "B.Sc Mathematics",
        subjects: ["Mathematics"],
        classes: ["6", "7", "8", "9", "10"],
        languages: ["Hindi", "English"],
        hourlyRate: 200,
        experience: 3,
        rating: 4.6,
        isVerified: true,
        isOnline: false,
        availability: ["Afternoon", "Evening"],
        bio: "Patient mathematics tutor for school students."
    },
    {
        name: "Sneha Singh",
        email: "sneha.singh@edubridge.demo",
        qualification: "MBBS",
        subjects: ["Biology"],
        classes: ["11", "12", "NEET"],
        languages: ["Hindi", "English"],
        hourlyRate: 500,
        experience: 4,
        rating: 4.9,
        isVerified: true,
        isOnline: true,
        availability: ["Evening"],
        bio: "Medical student helping NEET aspirants with Biology."
    },
    {
        name: "Vikas Kumar",
        email: "vikas.kumar@edubridge.demo",
        qualification: "B.Tech CSE",
        subjects: ["Computer Science", "Programming"],
        classes: ["9", "10", "11", "12", "College"],
        languages: ["Hindi", "English"],
        hourlyRate: 350,
        experience: 3,
        rating: 4.7,
        isVerified: true,
        isOnline: true,
        availability: ["Evening", "Night"],
        bio: "Programming tutor specializing in Java and Python."
    },
    {
        name: "Anjali Mishra",
        email: "anjali.mishra@edubridge.demo",
        qualification: "M.A. English",
        subjects: ["English"],
        classes: ["6", "7", "8", "9", "10", "11", "12"],
        languages: ["Hindi", "English"],
        hourlyRate: 250,
        experience: 6,
        rating: 4.8,
        isVerified: true,
        isOnline: true,
        availability: ["Morning", "Evening"],
        bio: "English language and communication specialist."
    },
    {
        name: "Mohit Yadav",
        email: "mohit.yadav@edubridge.demo",
        qualification: "B.Sc Physics",
        subjects: ["Physics"],
        classes: ["11", "12", "JEE"],
        languages: ["Hindi", "English"],
        hourlyRate: 400,
        experience: 5,
        rating: 4.7,
        isVerified: true,
        isOnline: true,
        availability: ["Evening"],
        bio: "Physics tutor with strong JEE preparation experience."
    },
    {
        name: "Neha Agarwal",
        email: "neha.agarwal@edubridge.demo",
        qualification: "B.Ed",
        subjects: ["Mathematics", "Science"],
        classes: ["6", "7", "8", "9", "10"],
        languages: ["Hindi", "English"],
        hourlyRate: 220,
        experience: 7,
        rating: 4.8,
        isVerified: true,
        isOnline: false,
        availability: ["Morning", "Afternoon"],
        bio: "School teacher experienced in foundational learning."
    },
    {
        name: "Arjun Patel",
        email: "arjun.patel@edubridge.demo",
        qualification: "B.Tech Mechanical",
        subjects: ["Physics", "Mathematics"],
        classes: ["9", "10", "11", "12"],
        languages: ["Hindi", "English", "Gujarati"],
        hourlyRate: 280,
        experience: 2,
        rating: 4.5,
        isVerified: true,
        isOnline: true,
        availability: ["Evening"],
        bio: "Engineering graduate passionate about teaching science."
    },
    {
        name: "Pooja Kumari",
        email: "pooja.kumari@edubridge.demo",
        qualification: "M.Sc Biology",
        subjects: ["Biology", "Science"],
        classes: ["8", "9", "10", "11", "12"],
        languages: ["Hindi", "English"],
        hourlyRate: 300,
        experience: 4,
        rating: 4.6,
        isVerified: true,
        isOnline: true,
        availability: ["Afternoon", "Evening"],
        bio: "Biology and science tutor for school and NEET students."
    },
    {
        name: "Karan Singh",
        email: "karan.singh@edubridge.demo",
        qualification: "B.Tech CSE",
        subjects: ["Computer Science", "Java", "Python"],
        classes: ["11", "12", "College"],
        languages: ["Hindi", "English"],
        hourlyRate: 450,
        experience: 4,
        rating: 4.9,
        isVerified: true,
        isOnline: true,
        availability: ["Evening", "Night"],
        bio: "Software developer and programming mentor."
    },
    {
        name: "Riya Das",
        email: "riya.das@edubridge.demo",
        qualification: "M.A. English",
        subjects: ["English", "Communication"],
        classes: ["9", "10", "11", "12", "College"],
        languages: ["English", "Hindi", "Bengali"],
        hourlyRate: 300,
        experience: 5,
        rating: 4.7,
        isVerified: true,
        isOnline: true,
        availability: ["Morning", "Evening"],
        bio: "English communication and academic writing tutor."
    },
    {
        name: "Saurabh Tiwari",
        email: "saurabh.tiwari@edubridge.demo",
        qualification: "M.Sc Mathematics",
        subjects: ["Mathematics"],
        classes: ["10", "11", "12", "JEE"],
        languages: ["Hindi", "English"],
        hourlyRate: 450,
        experience: 8,
        rating: 4.9,
        isVerified: true,
        isOnline: true,
        availability: ["Evening", "Night"],
        bio: "Senior mathematics mentor for board and JEE preparation."
    },
    {
        name: "Kavya Nair",
        email: "kavya.nair@edubridge.demo",
        qualification: "B.Sc Biology",
        subjects: ["Biology", "Science"],
        classes: ["6", "7", "8", "9", "10", "11", "12"],
        languages: ["English", "Hindi", "Malayalam"],
        hourlyRate: 250,
        experience: 3,
        rating: 4.6,
        isVerified: true,
        isOnline: true,
        availability: ["Morning", "Afternoon"],
        bio: "Friendly biology tutor focusing on concept clarity."
    },
    {
        name: "Deepak Joshi",
        email: "deepak.joshi@edubridge.demo",
        qualification: "B.Tech CSE",
        subjects: ["Programming", "Computer Science"],
        classes: ["10", "11", "12", "College"],
        languages: ["Hindi", "English"],
        hourlyRate: 350,
        experience: 3,
        rating: 4.7,
        isVerified: true,
        isOnline: true,
        availability: ["Evening"],
        bio: "Computer science tutor specializing in programming fundamentals."
    },
    {
        name: "Meera Kapoor",
        email: "meera.kapoor@edubridge.demo",
        qualification: "M.Sc Physics",
        subjects: ["Physics", "Mathematics"],
        classes: ["11", "12", "JEE"],
        languages: ["Hindi", "English"],
        hourlyRate: 420,
        experience: 6,
        rating: 4.8,
        isVerified: true,
        isOnline: true,
        availability: ["Evening", "Night"],
        bio: "Physics educator focused on numerical problem solving."
    },
    {
        name: "Rohit Sharma",
        email: "rohit.sharma@edubridge.demo",
        qualification: "B.Ed",
        subjects: ["Mathematics", "Science"],
        classes: ["6", "7", "8", "9", "10"],
        languages: ["Hindi"],
        hourlyRate: 180,
        experience: 5,
        rating: 4.5,
        isVerified: true,
        isOnline: false,
        availability: ["Afternoon", "Evening"],
        bio: "Affordable local tutor for school students."
    },
    {
        name: "Ishita Roy",
        email: "ishita.roy@edubridge.demo",
        qualification: "M.A. History",
        subjects: ["History", "Social Science"],
        classes: ["6", "7", "8", "9", "10", "11", "12"],
        languages: ["Hindi", "English", "Bengali"],
        hourlyRate: 220,
        experience: 4,
        rating: 4.6,
        isVerified: true,
        isOnline: true,
        availability: ["Morning", "Evening"],
        bio: "Social science tutor using interactive teaching methods."
    },
    {
        name: "Aditya Verma",
        email: "aditya.verma@edubridge.demo",
        qualification: "B.Tech CSE",
        subjects: ["Mathematics", "Programming"],
        classes: ["10", "11", "12", "College"],
        languages: ["Hindi", "English"],
        hourlyRate: 320,
        experience: 2,
        rating: 4.5,
        isVerified: true,
        isOnline: true,
        availability: ["Evening"],
        bio: "Young technology enthusiast and mathematics tutor."
    },
    {
        name: "Nisha Gupta",
        email: "nisha.gupta@edubridge.demo",
        qualification: "M.Com",
        subjects: ["Commerce", "Accountancy", "Economics"],
        classes: ["11", "12", "College"],
        languages: ["Hindi", "English"],
        hourlyRate: 300,
        experience: 5,
        rating: 4.7,
        isVerified: true,
        isOnline: true,
        availability: ["Evening", "Night"],
        bio: "Commerce tutor specializing in Accountancy and Economics."
    }
];

const seedTutors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected for seeding ✅");

        await Tutor.deleteMany();

        await Tutor.insertMany(tutors);

        console.log(`${tutors.length} tutors inserted successfully ✅`);

        await mongoose.connection.close();

        console.log("Database connection closed.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed ❌");
        console.error(error);
        process.exit(1);
    }
};

seedTutors();