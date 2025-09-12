// Sample data based on Prisma schema
export const samplePosts = [
    {
        id: 1,
        title: "My First Perfect Grade Build!",
        content:
            "Just finished my first Perfect Grade kit - the RX-78-2 Gundam. This was such an amazing experience! The detail level is incredible and the inner frame is so satisfying to build. Took me about 20 hours over 2 weeks. The articulation is fantastic and it looks amazing on my shelf. Already planning my next PG build!",
        author: {
            userId: 1,
            displayName: "GundamBuilder2024",
            email: "builder@example.com",
        },
        build: {
            id: 1,
            kitName: "PG RX-78-2 Gundam",
            grade: "Perfect Grade",
            difficulty: 8,
            customizations:
                "Panel lined with Gundam markers, topcoated with matte finish",
        },
        likedBy: [
            { id: 1, userId: 2 },
            { id: 2, userId: 3 },
            { id: 3, userId: 4 },
        ],
        comments: [
            { id: 1, content: "Amazing work!" },
            { id: 2, content: "The panel lining looks great!" },
        ],
        createdAt: "2024-09-10T14:30:00Z",
    },
    {
        id: 2,
        title: "Barbatos Custom Paint Job",
        content:
            "Spent the weekend doing a custom paint scheme on my HG Barbatos. Went with a desert camouflage theme inspired by military vehicles. Used Vallejo acrylics and an airbrush for the base coats, then hand-painted the details. Really happy with how the weathering turned out!",
        author: {
            userId: 2,
            displayName: "MobileSuitCustoms",
            email: "customs@example.com",
        },
        build: {
            id: 2,
            kitName: "HG Gundam Barbatos",
            grade: "High Grade",
            difficulty: 6,
            customizations:
                "Full repaint in desert camo scheme, weathering effects, custom decals",
        },
        likedBy: [
            { id: 4, userId: 1 },
            { id: 5, userId: 3 },
            { id: 6, userId: 4 },
            { id: 7, userId: 5 },
        ],
        comments: [
            { id: 3, content: "That weathering is spot on!" },
            { id: 4, content: "Love the camo pattern" },
            { id: 5, content: "Tutorial please!" },
        ],
        createdAt: "2024-09-09T18:45:00Z",
    },
    {
        id: 3,
        title: "Quick Real Grade Strike Freedom Build",
        content:
            "Built the new Real Grade Strike Freedom over the weekend. This kit is absolutely incredible! The engineering is mind-blowing - the wings are fully articulated and the detail is amazing for a 1/144 scale. No paint needed, just some panel lining and it looks fantastic. Bandai really outdid themselves with this one.",
        author: {
            userId: 3,
            displayName: "RealGradeMaster",
            email: "rgmaster@example.com",
        },
        build: {
            id: 3,
            kitName: "RG Strike Freedom Gundam",
            grade: "Real Grade",
            difficulty: 7,
            customizations:
                "Panel lining with gray markers, clear coat on metallic parts",
        },
        likedBy: [
            { id: 8, userId: 1 },
            { id: 9, userId: 2 },
        ],
        comments: [{ id: 6, content: "RG engineering is insane these days!" }],
        createdAt: "2024-09-08T20:15:00Z",
    },
    {
        id: 4,
        title: "Kitbashing Experiment - Zaku + GM",
        content:
            "Tried my first kitbashing project combining parts from a Zaku II and a GM. The idea was to create a captured Zaku that was retrofitted by the Earth Federation. Mixed the GM's backpack with the Zaku body and added some Federation markings. It was challenging but really fun to figure out the proportions!",
        author: {
            userId: 4,
            displayName: "KitbasherExtraordinaire",
            email: "kitbash@example.com",
        },
        build: {
            id: 4,
            kitName: "Custom Zaku-GM Hybrid",
            grade: "High Grade",
            difficulty: 9,
            customizations:
                "Kitbashed from HG Zaku II and GM, custom paint scheme, scratch-built details",
        },
        likedBy: [
            { id: 10, userId: 1 },
            { id: 11, userId: 2 },
            { id: 12, userId: 3 },
            { id: 13, userId: 5 },
            { id: 14, userId: 6 },
        ],
        comments: [
            { id: 7, content: "Creative concept!" },
            { id: 8, content: "The proportions work really well" },
        ],
        createdAt: "2024-09-07T16:20:00Z",
    },
    {
        id: 5,
        title: "Master Grade Sazabi Ver Ka Complete!",
        content:
            "Finally finished this beast! The MG Sazabi Ver Ka was definitely a challenge but so worth it. The amount of detail in this kit is incredible, especially the psycho-frame parts. The waterslide decals took forever but really make the kit pop. This is definitely going to be the centerpiece of my collection.",
        author: {
            userId: 5,
            displayName: "VerKaCollector",
            email: "verka@example.com",
        },
        build: {
            id: 5,
            kitName: "MG Sazabi Ver.Ka",
            grade: "Master Grade",
            difficulty: 9,
            customizations:
                "Full waterslide decal set, panel lining, gloss topcoat on certain parts",
        },
        likedBy: [
            { id: 15, userId: 1 },
            { id: 16, userId: 2 },
            { id: 17, userId: 3 },
            { id: 18, userId: 4 },
        ],
        comments: [
            { id: 9, content: "Ver.Ka kits are the best!" },
            { id: 10, content: "Those decals must have taken hours" },
            { id: 11, content: "Sazabi is such an iconic design" },
        ],
        createdAt: "2024-09-06T12:00:00Z",
    },
];

// Helper function to get random posts
export const getRandomPosts = (count = 5) => {
    const shuffled = [...samplePosts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, samplePosts.length));
};
