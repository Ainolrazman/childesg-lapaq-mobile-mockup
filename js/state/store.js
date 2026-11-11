import { getTodayDateString, getMaxCalendarDateString } from '../utils/helpers.js';

const todayDateStr = getTodayDateString();
const maxDateStr = getMaxCalendarDateString();

export function createInitialState() {
    return {
        selectedChild: 'adam',
        currentAuthTab: 'register',
        currentUserRole: 'parent',
        currentPartnerView: 'dashboard',
        partnerDashboardLayer: 'esg',
        activeParticipantGroup: '',
        currentLang: 'en',
        activeTabKey: 'layer1',
        pendingMarketplaceProgram: null,
        lapaqTimeSpan: '1day',
        lapaqStartDate: '',
        lapaqEndDate: todayDateStr,
        marketplaceSearchQuery: '',
        marketplaceStartDate: todayDateStr,
        marketplaceEndDate: maxDateStr,
        userProfiles: {
            parent: {
                name: "Ainol Razman Bin Mohd Ghazaly",
                email: "ainol.razman@example.com",
                phone: "+6012-3456789",
                state: "W.P. Kuala Lumpur / Selangor",
                address: "No. 12, Jalan SS2/24, Petaling Jaya, Selangor",
                dob: "1969-05-12",
                occupation: "Technology Founder"
            },
            partner: {
                orgName: "Kemaih Sdn Bhd",
                regNumber: "202001012345 (1389200-X)",
                email: "admin@kemaih.my",
                contactPerson: "Ainol Razman Bin Mohd Ghazaly",
                designation: "Chief Executive Officer (CEO)",
                personEmail: "ainol@kemaih.my",
                personPhone: "+6012-3456789"
            }
        },
        pendingApplications: [
            {
                childKey: "adam",
                childName: "Adam bin Ainol",
                courseName: "AI Nutrition & Health Junior Bootcamp",
                parentName: "Ainol Razman Bin Mohd Ghazaly",
                contact: "+6012-3456789 / ainol.razman@example.com",
                parentEmail: "ainol.razman@example.com"
            },
            {
                childKey: "maya",
                childName: "Maya binti Ainol",
                courseName: "Child Growth Tracking Workshop",
                parentName: "Ainol Razman Bin Mohd Ghazaly",
                contact: "+6012-3456789 / ainol.razman@example.com",
                parentEmail: "ainol.razman@example.com"
            }
        ],
        childrenData: {
            adam: {
                name: "Adam",
                age: "8 Yrs Old",
                gender: "Boy",
                school: "SK Petaling Jaya",
                token: "#AB-34X-KEMAIH",
                height: 132.5,
                weight: 28.2,
                bmi: "16.1 kg/m²",
                stuntingStatus: "Normal Height-for-Age (No Stunting)",
                wastingStatus: "Normal BMI-for-Age (No Wasting/Overweight)",
                impactScore: 88,
                volunteerHours: 32.5,
                esgCoursesCount: 4,
                sdgActionsCount: 18,
                leadershipBadges: 5,
                impactTokens: 450,
                activeHours: 12.5,
                ecoTokens: 300,
                foodWasteKg: 4.2,
                nutritionTokens: 250,
                activityTokens: 150,
                activityHours: 28.0,
                communityTokens: 100,
                totalTokens: 1250,
                rniStatus: "Balanced Target Met (100% RNI)",
                rniClaimed: false,
                courses: [
                    { name: "Vegan Cooking Class Cohort 3/2026", attendance: "100%", stars: 5, status: "Completed" },
                    { name: "Junior Eco-Warrior Bootcamp 2/2026", attendance: "95%", stars: 5, status: "Active" }
                ],
                appliedCourses: [
                    { name: "AI Nutrition & Health Junior Bootcamp", org: "Kemaih Sdn Bhd", status: "Pending Approval" }
                ]
            },
            maya: {
                name: "Maya",
                age: "5 Yrs Old",
                gender: "Girl",
                school: "Taska Permata KEMAS Petaling Jaya",
                token: "#MY-99Z-PERMATA",
                height: 108.2,
                weight: 18.0,
                bmi: "15.4 kg/m²",
                stuntingStatus: "Normal Height-for-Age (No Stunting)",
                wastingStatus: "Normal BMI-for-Age (No Wasting/Overweight)",
                impactScore: 82,
                volunteerHours: 20.0,
                esgCoursesCount: 3,
                sdgActionsCount: 12,
                leadershipBadges: 4,
                impactTokens: 300,
                activeHours: 9.0,
                ecoTokens: 200,
                foodWasteKg: 2.8,
                nutritionTokens: 180,
                activityTokens: 80,
                activityHours: 18.5,
                communityTokens: 60,
                totalTokens: 820,
                rniStatus: "Balanced Target Met (95% RNI)",
                rniClaimed: false,
                courses: [
                    { name: "Zero Waste Kids Workshop Cohort 1/2026", attendance: "90%", stars: 4, status: "Active" }
                ],
                appliedCourses: [
                    { name: "Child Growth Tracking Workshop", org: "Kemaih Sdn Bhd", status: "Pending Approval" }
                ]
            }
        },
        organizationCoursesMap: {
            "Kemaih Sdn Bhd": [
                "AI Nutrition & Health Junior Bootcamp",
                "Child Growth Tracking Workshop"
            ],
            "KEMAS (Jabatan Kemajuan Masyarakat)": [
                "Taska Permata Early Literacy Program",
                "Children Creative Art & Craft Day"
            ],
            "Universiti Kebangsaan Malaysia (UKM)": [
                "Junior Science Explorer Camp",
                "Young Nutritionist Discovery Workshop"
            ],
            "Malaysian Nature Society (MNS)": [
                "Junior Eco-Warrior Forest Walk",
                "Butterfly & Insect Habitat Conservation Course"
            ],
            "Kuala Lumpur Junior Rugby Club": [
                "Basic Rugby Skills & Teamwork Clinic",
                "Youth Touch Rugby Summer Training"
            ],
            "WWF-Malaysia": [
                "Save Our Malayan Tigers Youth Workshop",
                "Clean Rivers & Marine Life Protection Camp"
            ],
            "MRANTI (Malaysia Research Accelerator for Technology & Innovation)": [
                "Kids Coding & Robotics Beginner Workshop",
                "Future Innovators 3D Printing Class"
            ],
            "Yayasan Pahang": [
                "East Coast Youth Leadership Camp",
                "Heritage Storytelling & Cultural Arts Course"
            ],
            "Jaya Grocer Community Kitchen": [
                "Junior Healthy Cooking & Baking Masterclass",
                "Zero Waste Grocery Shopping Adventure"
            ],
            "Decathlon Malaysia Sports Academy": [
                "Kids Fun Athletics & Agility Training",
                "Junior Cycling Safety & Balance Clinic"
            ]
        },
        featuredProgramsList: [
            {
                org: "Kemaih Sdn Bhd",
                rating: 5,
                ratingScore: "5.0",
                sdgs: [2, 3, 4],
                title: "AI Nutrition & Health Junior Bootcamp",
                category: "Nutrition and Health",
                desc: "An immersive program teaching children and teens the fundamentals of balanced nutrition, caloric tracking, and artificial intelligence in food science.",
                slots: "30 Available",
                reward: "150 Impact Tokens",
                badge: "🌱 ESG Certified",
                startDate: "2026-10-19",
                endDate: "2026-11-19"
            },
            {
                org: "KEMAS (Jabatan Kemajuan Masyarakat)",
                rating: 5,
                ratingScore: "4.9",
                sdgs: [4, 10],
                title: "Taska Permata Early Literacy Program",
                category: "Community & Leadership",
                desc: "Interactive reading, phonics, and cognitive development sessions tailored for early childhood growth across community centers.",
                slots: "15 Available",
                reward: "100 Impact Tokens",
                badge: "📚 Community",
                startDate: "2026-10-20",
                endDate: "2026-12-20"
            },
            {
                org: "Universiti Kebangsaan Malaysia (UKM)",
                rating: 5,
                ratingScore: "5.0",
                sdgs: [2, 3, 4],
                title: "Young Nutritionist Discovery Workshop",
                category: "Nutrition and Health",
                desc: "Led by expert nutritionists, kids learn food grouping, RNI metrics, and healthy cooking habits through hands-on experiments.",
                slots: "20 Available",
                reward: "120 Impact Tokens",
                badge: "🔬 Academic Partner",
                startDate: "2026-10-25",
                endDate: "2026-11-25"
            },
            {
                org: "Malaysian Nature Society (MNS)",
                rating: 4,
                ratingScore: "4.8",
                sdgs: [13, 15],
                title: "Junior Eco-Warrior Forest Walk",
                category: "Environment",
                desc: "Outdoor guided exploration focusing on local flora and fauna biodiversity conservation and tree planting.",
                slots: "25 Available",
                reward: "200 Impact Tokens",
                badge: "🌿 Environmental",
                startDate: "2026-11-01",
                endDate: "2026-11-02"
            },
            {
                org: "Kuala Lumpur Junior Rugby Club",
                rating: 5,
                ratingScore: "4.9",
                sdgs: [3, 17],
                title: "Basic Rugby Skills & Teamwork Clinic",
                category: "Physical & Sports",
                desc: "Non-contact touch rugby drills designed to foster teamwork, agility, stamina, and cardiovascular health.",
                slots: "40 Available",
                reward: "150 Impact Tokens",
                badge: "⚡ Physical Health",
                startDate: "2026-11-10",
                endDate: "2026-12-10"
            },
            {
                org: "Jaya Grocer Community Kitchen",
                rating: 4,
                ratingScore: "4.7",
                sdgs: [2, 12],
                title: "Junior Healthy Cooking & Baking Masterclass",
                category: "Nutrition and Health",
                desc: "Hands-on culinary class teaching children how to prepare wholesome meals with zero food waste ingredients.",
                slots: "12 Available",
                reward: "180 Impact Tokens",
                badge: "🥗 Zero Waste",
                startDate: "2026-11-15",
                endDate: "2026-11-16"
            }
        ],
        participantGroups: {
            "Vegan Cooking Class Cohort 3/2026": [
                { name: "Adam bin Ainol", token: "#AB-34X-KEMAIH", attendanceRate: "100%", stars: 5, status: "Normal" },
                { name: "Nurul Ain", token: "#NA-88Y-PJ01", attendanceRate: "90%", stars: 4, status: "Normal" },
                { name: "Marcus Tan", token: "#MT-12Z-PJ02", attendanceRate: "75%", stars: 3, status: "Overweight Risk" }
            ],
            "Zero Waste Kids Workshop Cohort 1/2026": [
                { name: "Siti Aminah", token: "#SA-11X-KL01", attendanceRate: "95%", stars: 5, status: "Normal" },
                { name: "Daniel Wong", token: "#DW-22Y-KL02", attendanceRate: "88%", stars: 4, status: "Normal" },
                { name: "Aishah Binti Omar", token: "#AO-33Z-KL03", attendanceRate: "92%", stars: 5, status: "Normal" }
            ]
        },
        notificationsData: {
            parent: [
                {
                    type: "approval",
                    icon: "🎓",
                    title: "Program Application Approved",
                    time: "10m ago",
                    color: "blue",
                    message: "Adam's registration for 'AI Nutrition & Health Junior Bootcamp' has been officially approved by Kemaih Sdn Bhd."
                },
                {
                    type: "milestone",
                    icon: "🥗",
                    title: "LaPaQ RNI Milestone Met",
                    time: "2h ago",
                    color: "emerald",
                    message: "Maya reached 95% balanced RNI target today! 10 Nutrition Tokens are ready to be claimed in her wallet."
                },
                {
                    type: "token",
                    icon: "🪙",
                    title: "Tokens Earned",
                    time: "1d ago",
                    color: "amber",
                    message: "Adam earned 25 Impact Tokens for completing the Junior Eco-Warrior Station QR Scan."
                }
            ],
            partner: [
                {
                    type: "incoming_app",
                    icon: "📥",
                    title: "New Application Received",
                    time: "5m ago",
                    color: "amber",
                    message: "Ainol Razman submitted an application for Adam bin Ainol in 'AI Nutrition & Health Junior Bootcamp'."
                },
                {
                    type: "esg_audit",
                    icon: "🛡️",
                    title: "ESG Audit Report Updated",
                    time: "1d ago",
                    color: "purple",
                    message: "Silver Verified Institution status (82/100) successfully updated and hashed in the partner audit registry."
                },
                {
                    type: "roster_milestone",
                    icon: "📊",
                    title: "Program Roster Update",
                    time: "2d ago",
                    color: "blue",
                    message: "33 participants registered and active in 'Vegan Cooking Class Cohort 3/2026'."
                }
            ]
        },
        sdgCatalog: [
            { id: 2, icon: '🥗', name: 'Zero Hunger', bm: 'Sifar Kelaparan', color: 'amber', desc: 'Nutrition education, food access and healthier meals.' },
            { id: 3, icon: '💚', name: 'Good Health & Well-being', bm: 'Kesihatan Baik dan Kesejahteraan', color: 'emerald', desc: 'Healthy habits, physical activity and well-being.' },
            { id: 4, icon: '📚', name: 'Quality Education', bm: 'Pendidikan Berkualiti', color: 'red', desc: 'Learning, skills, participation and lifelong learning.' },
            { id: 12, icon: '♻️', name: 'Responsible Consumption', bm: 'Penggunaan Bertanggungjawab', color: 'yellow', desc: 'Food waste reduction, reuse and responsible choices.' },
            { id: 13, icon: '🌱', name: 'Climate Action', bm: 'Tindakan Iklim', color: 'green', desc: 'Climate awareness and measurable environmental action.' },
            { id: 17, icon: '🤝', name: 'Partnerships for the Goals', bm: 'Kerjasama demi Matlamat', color: 'blue', desc: 'Schools, families, businesses and community partners working together.' }
        ],
        sdgSelectedFilter: 'all',
        sdgSelectedChild: 'all',
        sdgEvidenceRecords: [
            { id: 'DEMO-001', child: 'adam', title: 'Junior Eco-Warrior Bootcamp', sdgs: [4, 12, 13], category: 'environment', date: '2026-09-12', measure: 'Workshop attendance', value: 1, unit: 'participant', evidence: 'Demo attendance record', status: 'verified', note: 'Participation output only; environmental outcome not yet measured.' },
            { id: 'DEMO-002', child: 'maya', title: 'Healthy Cooking & Zero-Waste Workshop', sdgs: [2, 3, 12], category: 'nutrition', date: '2026-09-18', measure: 'Workshop attendance', value: 1, unit: 'participant', evidence: 'Demo partner attendance sheet', status: 'pending', note: 'Awaiting authorised partner review.' },
            { id: 'DEMO-003', child: 'adam', title: 'Young Nutritionist Discovery Workshop', sdgs: [2, 3, 4], category: 'nutrition', date: '2026-09-22', measure: 'Learning activity completed', value: 1, unit: 'activity', evidence: 'Demo completion record', status: 'verified', note: 'Learning outcome needs a pre/post assessment to be quantified.' },
            { id: 'DEMO-004', child: 'maya', title: 'Community Learning Day', sdgs: [4, 17], category: 'education', date: '2026-09-28', measure: 'Community activity attendance', value: 1, unit: 'participant', evidence: 'Demo event record', status: 'pending', note: 'Partner confirmation required.' }
        ]
    };
}

export let state = createInitialState();

export function resetState() {
    state = createInitialState();
}
