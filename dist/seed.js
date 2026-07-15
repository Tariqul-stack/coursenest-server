import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Course from './models/Course';
dotenv.config();
const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected ✅');
        await User.deleteMany({});
        await Course.deleteMany({});
        console.log('Cleared existing data ✅');
        const hashedPassword = await bcrypt.hash('admin123', 12);
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@coursenest.com',
            password: hashedPassword,
            role: 'admin',
            bio: 'Platform administrator',
            avatar: 'https://i.pravatar.cc/150?img=1',
        });
        const teacher1 = await User.create({
            name: 'Sarah Johnson',
            email: 'teacher@coursenest.com',
            password: hashedPassword,
            role: 'teacher',
            bio: 'Full-stack developer with 8 years of experience. Passionate about teaching React and Node.js.',
            avatar: 'https://i.pravatar.cc/150?img=5',
        });
        const teacher2 = await User.create({
            name: 'Michael Chen',
            email: 'teacher2@coursenest.com',
            password: hashedPassword,
            role: 'teacher',
            bio: 'UI/UX designer and Figma expert. I have helped 10,000+ students master design.',
            avatar: 'https://i.pravatar.cc/150?img=3',
        });
        const student = await User.create({
            name: 'Alex Student',
            email: 'student@coursenest.com',
            password: hashedPassword,
            role: 'student',
            bio: 'Aspiring developer learning full-stack development.',
            avatar: 'https://i.pravatar.cc/150?img=9',
        });
        console.log('Users created ✅');
        await Course.insertMany([
            {
                title: 'Complete React Developer Course 2025',
                shortDescription: 'Master React from scratch with hooks, context, Redux and real projects.',
                fullDescription: 'This comprehensive React course will take you from beginner to advanced. You will learn React fundamentals, hooks, context API, Redux toolkit, React Query, and build 5 real-world projects.',
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
                price: 49.99,
                isFree: false,
                category: 'Web Development',
                level: 'Beginner',
                tags: ['react', 'javascript', 'frontend', 'hooks'],
                instructor: teacher1._id,
                status: 'published',
                totalEnrollments: 1240,
                averageRating: 4.8,
                totalReviews: 320,
                curriculum: [
                    {
                        moduleId: 'mod-1',
                        title: 'Getting Started with React',
                        order: 1,
                        lessons: [
                            { lessonId: 'les-1', title: 'What is React?', videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA', duration: 12, order: 1, isFreePreview: true },
                            { lessonId: 'les-2', title: 'Setting up the environment', videoUrl: '', duration: 15, order: 2, isFreePreview: false },
                        ],
                    },
                    {
                        moduleId: 'mod-2',
                        title: 'React Hooks Deep Dive',
                        order: 2,
                        lessons: [
                            { lessonId: 'les-3', title: 'useState and useEffect', videoUrl: '', duration: 25, order: 1, isFreePreview: false },
                            { lessonId: 'les-4', title: 'useContext and useReducer', videoUrl: '', duration: 30, order: 2, isFreePreview: false },
                        ],
                    },
                ],
            },
            {
                title: 'UI/UX Design Masterclass with Figma',
                shortDescription: 'Learn professional UI/UX design from scratch using Figma.',
                fullDescription: 'Master the art of UI/UX design with this comprehensive Figma course. You will learn design principles, wireframing, prototyping, user research, and design systems.',
                thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
                price: 39.99,
                isFree: false,
                category: 'UI/UX Design',
                level: 'Beginner',
                tags: ['figma', 'design', 'ux', 'ui'],
                instructor: teacher2._id,
                status: 'published',
                totalEnrollments: 890,
                averageRating: 4.9,
                totalReviews: 210,
                curriculum: [
                    {
                        moduleId: 'mod-1',
                        title: 'Introduction to UI/UX',
                        order: 1,
                        lessons: [
                            { lessonId: 'les-1', title: 'What is UI/UX Design?', videoUrl: '', duration: 10, order: 1, isFreePreview: true },
                            { lessonId: 'les-2', title: 'Design Thinking Process', videoUrl: '', duration: 20, order: 2, isFreePreview: false },
                        ],
                    },
                ],
            },
            {
                title: 'Node.js & Express Backend Development',
                shortDescription: 'Build scalable REST APIs with Node.js, Express, and MongoDB.',
                fullDescription: 'Learn backend development with Node.js and Express. This course covers REST API design, authentication with JWT, MongoDB with Mongoose, and deployment.',
                thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop',
                price: 44.99,
                isFree: false,
                category: 'Web Development',
                level: 'Intermediate',
                tags: ['nodejs', 'express', 'mongodb', 'backend'],
                instructor: teacher1._id,
                status: 'published',
                totalEnrollments: 760,
                averageRating: 4.7,
                totalReviews: 180,
                curriculum: [
                    {
                        moduleId: 'mod-1',
                        title: 'Node.js Fundamentals',
                        order: 1,
                        lessons: [
                            { lessonId: 'les-1', title: 'Introduction to Node.js', videoUrl: '', duration: 15, order: 1, isFreePreview: true },
                            { lessonId: 'les-2', title: 'npm and package management', videoUrl: '', duration: 12, order: 2, isFreePreview: false },
                        ],
                    },
                ],
            },
            {
                title: 'Python for Data Science & Machine Learning',
                shortDescription: 'Master Python, Pandas, NumPy, and Scikit-learn for data science.',
                fullDescription: 'This complete data science course covers Python programming, data manipulation with Pandas, numerical computing with NumPy, data visualization, and machine learning.',
                thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&auto=format&fit=crop',
                price: 0,
                isFree: true,
                category: 'Data Science',
                level: 'Beginner',
                tags: ['python', 'data science', 'machine learning', 'pandas'],
                instructor: teacher2._id,
                status: 'published',
                totalEnrollments: 2100,
                averageRating: 4.6,
                totalReviews: 450,
                curriculum: [
                    {
                        moduleId: 'mod-1',
                        title: 'Python Basics',
                        order: 1,
                        lessons: [
                            { lessonId: 'les-1', title: 'Introduction to Python', videoUrl: '', duration: 20, order: 1, isFreePreview: true },
                        ],
                    },
                ],
            },
            {
                title: 'Digital Marketing Complete Guide',
                shortDescription: 'Master SEO, social media marketing, email campaigns, and paid ads.',
                fullDescription: 'Learn digital marketing from scratch. This course covers SEO, social media marketing, email marketing, Google Ads, Facebook Ads, content marketing, and analytics.',
                thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
                price: 34.99,
                isFree: false,
                category: 'Digital Marketing',
                level: 'Beginner',
                tags: ['seo', 'social media', 'marketing', 'ads'],
                instructor: teacher1._id,
                status: 'published',
                totalEnrollments: 540,
                averageRating: 4.5,
                totalReviews: 120,
                curriculum: [
                    {
                        moduleId: 'mod-1',
                        title: 'Digital Marketing Fundamentals',
                        order: 1,
                        lessons: [
                            { lessonId: 'les-1', title: 'What is Digital Marketing?', videoUrl: '', duration: 10, order: 1, isFreePreview: true },
                        ],
                    },
                ],
            },
            {
                title: 'TypeScript Complete Developer Guide',
                shortDescription: 'Master TypeScript from basics to advanced with React and Node.js.',
                fullDescription: 'This TypeScript course covers everything from basic types to advanced generics, decorators, and design patterns. Build real projects with TypeScript, React, and Node.js.',
                thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop',
                price: 0,
                isFree: true,
                category: 'Web Development',
                level: 'Intermediate',
                tags: ['typescript', 'javascript', 'react', 'nodejs'],
                instructor: teacher2._id,
                status: 'published',
                totalEnrollments: 980,
                averageRating: 4.9,
                totalReviews: 230,
                curriculum: [
                    {
                        moduleId: 'mod-1',
                        title: 'TypeScript Basics',
                        order: 1,
                        lessons: [
                            { lessonId: 'les-1', title: 'Why TypeScript?', videoUrl: '', duration: 8, order: 1, isFreePreview: true },
                            { lessonId: 'les-2', title: 'Types and Interfaces', videoUrl: '', duration: 22, order: 2, isFreePreview: false },
                        ],
                    },
                ],
            },
            {
                title: 'Mobile App Development with React Native',
                shortDescription: 'Build iOS and Android apps with React Native and Expo.',
                fullDescription: 'Learn to build cross-platform mobile apps using React Native and Expo. This course covers navigation, state management, API integration, push notifications, and deployment.',
                thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop',
                price: 54.99,
                isFree: false,
                category: 'Mobile Development',
                level: 'Intermediate',
                tags: ['react native', 'mobile', 'ios', 'android'],
                instructor: teacher1._id,
                status: 'published',
                totalEnrollments: 420,
                averageRating: 4.7,
                totalReviews: 95,
                curriculum: [
                    {
                        moduleId: 'mod-1',
                        title: 'React Native Fundamentals',
                        order: 1,
                        lessons: [
                            { lessonId: 'les-1', title: 'Setting up Expo', videoUrl: '', duration: 15, order: 1, isFreePreview: true },
                        ],
                    },
                ],
            },
            {
                title: 'Cybersecurity Fundamentals',
                shortDescription: 'Learn ethical hacking, network security, and penetration testing.',
                fullDescription: 'This cybersecurity course covers network fundamentals, ethical hacking techniques, penetration testing tools, web application security, and how to protect systems from attacks.',
                thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
                price: 59.99,
                isFree: false,
                category: 'Cybersecurity',
                level: 'Advanced',
                tags: ['security', 'hacking', 'network', 'penetration testing'],
                instructor: teacher2._id,
                status: 'published',
                totalEnrollments: 310,
                averageRating: 4.8,
                totalReviews: 75,
                curriculum: [
                    {
                        moduleId: 'mod-1',
                        title: 'Introduction to Cybersecurity',
                        order: 1,
                        lessons: [
                            { lessonId: 'les-1', title: 'What is Cybersecurity?', videoUrl: '', duration: 18, order: 1, isFreePreview: true },
                        ],
                    },
                ],
            },
        ]);
        console.log('8 courses created ✅');
        console.log('\n=== Demo Credentials ===');
        console.log('Admin:   admin@coursenest.com / admin123');
        console.log('Teacher: teacher@coursenest.com / admin123');
        console.log('Student: student@coursenest.com / admin123');
        console.log('========================\n');
        process.exit(0);
    }
    catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
};
seed();
