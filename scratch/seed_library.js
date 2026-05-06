const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'gunareddy',
    database: 'sms_db'
};

const books = [
    // Engineering
    { name: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", category: "Engineering", desc: "A Handbook of Agile Software Craftsmanship." },
    { name: "The Pragmatic Programmer", author: "Andrew Hunt", isbn: "978-0135957059", category: "Engineering", desc: "Your Journey To Mastery." },
    { name: "Design Patterns", author: "Erich Gamma", isbn: "978-0201633610", category: "Engineering", desc: "Elements of Reusable Object-Oriented Software." },
    { name: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0262033848", category: "Engineering", desc: "The standard reference for algorithms." },
    { name: "Structure and Interpretation of Computer Programs", author: "Harold Abelson", isbn: "978-0262510875", category: "Engineering", desc: "The Bible of Computer Science." },
    
    // Science
    { name: "A Brief History of Time", author: "Stephen Hawking", isbn: "978-0553380163", category: "Science", desc: "From the Big Bang to Black Holes." },
    { name: "The Selfish Gene", author: "Richard Dawkins", isbn: "978-0198788607", category: "Science", desc: "A landmark in evolutionary biology." },
    { name: "Cosmos", author: "Carl Sagan", isbn: "978-0345539434", category: "Science", desc: "The story of cosmic evolution." },
    { name: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot", isbn: "978-1400052189", category: "Science", desc: "Science, ethics, and race." },
    { name: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", isbn: "978-0062316097", category: "Science", desc: "How humans came to dominate the Earth." },

    // Mathematics
    { name: "The Princeton Companion to Mathematics", author: "Timothy Gowers", isbn: "978-0691118802", category: "Mathematics", desc: "A comprehensive guide to modern mathematics." },
    { name: "Gödel, Escher, Bach", author: "Douglas Hofstadter", isbn: "978-0465026562", category: "Mathematics", desc: "An Eternal Golden Braid." },
    { name: "Fermat's Enigma", author: "Simon Singh", isbn: "978-0385493628", category: "Mathematics", desc: "The epic quest to solve the world's greatest mathematical problem." },
    { name: "The Joy of x", author: "Steven Strogatz", isbn: "978-0544105102", category: "Mathematics", desc: "A Guided Tour of Math, from One to Infinity." },
    { name: "Infinite Powers", author: "Steven Strogatz", isbn: "978-1328879981", category: "Mathematics", desc: "How Calculus Reveals the Secrets of the Universe." },

    // Literature
    { name: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0060935467", category: "Literature", desc: "A classic of modern American literature." },
    { name: "1984", author: "George Orwell", isbn: "978-0451524935", category: "Literature", desc: "The definitive dystopian novel." },
    { name: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565", category: "Literature", desc: "The jazz age and the American dream." },
    { name: "One Hundred Years of Solitude", author: "Gabriel García Márquez", isbn: "978-0060883287", category: "Literature", desc: "The masterpiece of magical realism." },
    { name: "Brave New World", author: "Aldous Huxley", isbn: "978-0060850524", category: "Literature", desc: "A frightening vision of the future." },

    // History
    { name: "Guns, Germs, and Steel", author: "Jared Diamond", isbn: "978-0393354324", category: "History", desc: "The fates of human societies." },
    { name: "The Silk Roads", author: "Peter Frankopan", isbn: "978-1101912379", category: "History", desc: "A New History of the World." },
    { name: "Team of Rivals", author: "Doris Kearns Goodwin", isbn: "978-0684824901", category: "History", desc: "The political genius of Abraham Lincoln." },
    { name: "A People's History of the United States", author: "Howard Zinn", isbn: "978-0062397348", category: "History", desc: "History from the bottom up." },
    { name: "The Wright Brothers", author: "David McCullough", isbn: "978-1476728759", category: "History", desc: "The story of the pioneers of aviation." },

    // Technology
    { name: "Steve Jobs", author: "Walter Isaacson", isbn: "978-1451648539", category: "Technology", desc: "The exclusive biography." },
    { name: "The Innovators", author: "Walter Isaacson", isbn: "978-1476708706", category: "Technology", desc: "How a group of hackers, geniuses, and geeks created the digital revolution." },
    { name: "Zero to One", author: "Peter Thiel", isbn: "978-0804139298", category: "Technology", desc: "Notes on Startups, or How to Build the Future." },
    { name: "The Second Machine Age", author: "Erik Brynjolfsson", isbn: "978-0393350647", category: "Technology", desc: "Work, progress, and prosperity in a time of brilliant technologies." },
    { name: "Life 3.0", author: "Max Tegmark", isbn: "978-1101946596", category: "Technology", desc: "Being human in the age of Artificial Intelligence." },

    // Biography
    { name: "Becoming", author: "Michelle Obama", isbn: "978-1524763138", category: "Biography", desc: "An intimate, powerful, and inspiring memoir." },
    { name: "Long Walk to Freedom", author: "Nelson Mandela", isbn: "978-0316548182", category: "Biography", desc: "The autobiography of Nelson Mandela." },
    { name: "The Diary of a Young Girl", author: "Anne Frank", isbn: "978-0553296983", category: "Biography", desc: "A timeless testament to the human spirit." },
    { name: "Elon Musk", author: "Ashlee Vance", isbn: "978-0062301253", category: "Biography", desc: "Tesla, SpaceX, and the quest for a fantastic future." },
    { name: "Wings of Fire", author: "A.P.J. Abdul Kalam", isbn: "978-8173711466", category: "Biography", desc: "The autobiography of the Missile Man of India." }
];

async function seedLibrary() {
    const connection = await mysql.createConnection(dbConfig);
    console.log('🌱 Seeding Library with 35 fresh titles...');

    for (const book of books) {
        try {
            await connection.query(
                "INSERT INTO library (book_name, author, isbn, category, description, location) VALUES (?, ?, ?, ?, ?, ?)",
                [book.name, book.author, book.isbn, book.category, book.desc, "Central Library - Block A"]
            );
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.log(`⏩ Skipping duplicate: ${book.name}`);
            } else {
                console.error(`❌ Error inserting ${book.name}:`, err.message);
            }
        }
    }

    console.log('✅ Seeding Complete.');
    await connection.end();
}

seedLibrary();
