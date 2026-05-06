const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'gunareddy',
    database: 'sms_db'
};

const moreBooks = [
    // Engineering / Technology
    { name: "Code Complete", author: "Steve McConnell", isbn: "978-0735619678", category: "Engineering", desc: "A practical handbook of software construction." },
    { name: "Refactoring", author: "Martin Fowler", isbn: "978-0134757599", category: "Engineering", desc: "Improving the Design of Existing Code." },
    { name: "The Mythical Man-Month", author: "Frederick Brooks", isbn: "978-0201835953", category: "Engineering", desc: "Essays on Software Engineering." },
    { name: "Test Driven Development", author: "Kent Beck", isbn: "978-0321146533", category: "Engineering", desc: "By Example." },
    { name: "Working Effectively with Legacy Code", author: "Michael Feathers", isbn: "978-0131177055", category: "Engineering", desc: "Strategies for working with large, untested codebases." },
    { name: "Deep Learning", author: "Ian Goodfellow", isbn: "978-0262035613", category: "Technology", desc: "The definitive textbook on Deep Learning." },
    { name: "Hands-On Machine Learning", author: "Aurélien Géron", isbn: "978-1492032649", category: "Technology", desc: "With Scikit-Learn, Keras, and TensorFlow." },

    // Science / Mathematics
    { name: "The Elegant Universe", author: "Brian Greene", isbn: "978-0393338102", category: "Science", desc: "Superstrings, Hidden Dimensions, and the Quest for the Ultimate Theory." },
    { name: "Why We Sleep", author: "Matthew Walker", isbn: "978-1501144318", category: "Science", desc: "Unlocking the Power of Sleep and Dreams." },
    { name: "Thinking, Fast and Slow", author: "Daniel Kahneman", isbn: "978-0374275631", category: "Science", desc: "A deep dive into human cognition." },
    { name: "The Emperor of All Maladies", author: "Siddhartha Mukherjee", isbn: "978-1439170915", category: "Science", desc: "A Biography of Cancer." },
    { name: "Chaos: Making a New Science", author: "James Gleick", isbn: "978-0143113454", category: "Science", desc: "The birth of chaos theory." },
    { name: "Euclid's Elements", author: "Euclid", isbn: "978-1888009187", category: "Mathematics", desc: "The foundation of geometry." },
    { name: "Linear Algebra Done Right", author: "Sheldon Axler", isbn: "978-3319110790", category: "Mathematics", desc: "A clear and concise approach to linear algebra." },

    // Literature / Philosophy
    { name: "Crime and Punishment", author: "Fyodor Dostoevsky", isbn: "978-0143107637", category: "Literature", desc: "A psychological study of crime and redemption." },
    { name: "The Brothers Karamazov", author: "Fyodor Dostoevsky", isbn: "978-0374528379", category: "Literature", desc: "A complex exploration of faith and morality." },
    { name: "Meditations", author: "Marcus Aurelius", isbn: "978-0812968255", category: "Literature", desc: "Stoic philosophy from the Roman Emperor." },
    { name: "The Alchemist", author: "Paulo Coelho", isbn: "978-0062315007", category: "Literature", desc: "A fable about following your dream." },
    { name: "The Little Prince", author: "Antoine de Saint-Exupéry", isbn: "978-0156012195", category: "Literature", desc: "A timeless story for all ages." },
    { name: "Frankenstein", author: "Mary Shelley", isbn: "978-0143131847", category: "Literature", desc: "The original science fiction masterpiece." },
    { name: "Wuthering Heights", author: "Emily Brontë", isbn: "978-0141439556", category: "Literature", desc: "A tale of passion and revenge." },

    // History / Biography / Economics
    { name: "The Wealth of Nations", author: "Adam Smith", isbn: "978-0553585971", category: "History", desc: "The foundation of modern economics." },
    { name: "Capital in the Twenty-First Century", author: "Thomas Piketty", isbn: "978-0674430006", category: "History", desc: "An analysis of wealth inequality." },
    { name: "The Rise and Fall of the Third Reich", author: "William L. Shirer", isbn: "978-1451651683", category: "History", desc: "The definitive history of Nazi Germany." },
    { name: "SPQR: A History of Ancient Rome", author: "Mary Beard", isbn: "978-1631492426", category: "History", desc: "A sweeping history of the Roman Empire." },
    { name: "Shoe Dog", author: "Phil Knight", isbn: "978-1501135927", category: "Biography", desc: "A memoir by the creator of Nike." },
    { name: "Titan: The Life of John D. Rockefeller", author: "Ron Chernow", isbn: "978-1101912355", category: "Biography", desc: "The biography of the richest man in history." },
    { name: "Man's Search for Meaning", author: "Viktor Frankl", isbn: "978-0807014295", category: "Biography", desc: "A psychiatrist's experience in the Holocaust." },
    { name: "Alexander Hamilton", author: "Ron Chernow", isbn: "978-0143034759", category: "Biography", desc: "The inspiration for the hit musical." },
    { name: "I Am Malala", author: "Malala Yousafzai", isbn: "978-0316322409", category: "Biography", desc: "The girl who stood up for education." }
];

async function seedMore() {
    const connection = await mysql.createConnection(dbConfig);
    console.log('🌱 Adding 30 more premium titles to the collection...');

    for (const book of moreBooks) {
        try {
            await connection.query(
                "INSERT INTO library (book_name, author, isbn, category, description, location) VALUES (?, ?, ?, ?, ?, ?)",
                [book.name, book.author, book.isbn, book.category, book.desc, "Central Library - Block B"]
            );
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.log(`⏩ Skipping duplicate: ${book.name}`);
            } else {
                console.error(`❌ Error inserting ${book.name}:`, err.message);
            }
        }
    }

    console.log('✅ Collection Expansion Complete.');
    await connection.end();
}

seedMore();
