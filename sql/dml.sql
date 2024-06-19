-- Division
INSERT INTO public."Division" ("divisionId", "dname") VALUES
(1, 'Computer Science'),
(2, 'Mathematics'),
(3, 'Physics'),
(4, 'Statistics');

-- Profile (add department staff and admin users)
INSERT INTO public."Profile" ("profileId", "firstName", "middleName", "lastName", "email", "phoneNum", "officeBuilding", "officeNum", "position", "divisionId", "UBCId", "serviceHourCompleted", "sRoleBenchmark") VALUES
(1, 'John', NULL, 'Doe', 'john.doe@ubc.ca', '250-555-1212', 'SCI', '101', 'Professor', 1, 12345678, 15, 50),
(2, 'Jane', 'Allison', 'Smith', 'jane.smith@ubc.ca', '250-555-3456', 'ASC', '215', 'Associate Professor', 1, 23456789, 8, 120),
(3, 'Robert', NULL, 'Brown', 'robert.brown@ubc.ca', '250-555-7890', 'SCI', '302', 'Sessional Lecturer', 2, 34567890, 0, 100),
(4, 'Emily', NULL, 'Davis', 'emily.davis@ubc.ca', '250-555-2345', 'ART', '420', 'Professor Emeritus', 3, 45678901, 0, 0),
(5, 'Alice', NULL, 'Johnson', 'alice.johnson@ubc.ca', '250-555-9876', 'SCI', '200', 'Department Staff', 1, 56789012, 0, 0),
(6, 'Bob', NULL, 'Lee', 'bob.lee@ubc.ca', '250-555-5678', 'SCI', '200', 'Department Staff', 2, 67890123, 0, 0),
(7, 'Carol', NULL, 'Wilson', 'carol.wilson@maintenance.ca', '250-555-4321', NULL, NULL, 'Admin', NULL, NULL, 0, 0),
(8, 'David', NULL, 'Kim', 'david.kim@ubc.ca', '250-555-6789', 'SCI', '123', 'Professor', 1, 87654321, 20, 80),
(9, 'Sarah', 'Lee', 'Chen', 'sarah.chen@ubc.ca', '250-555-9012', 'SCI', '234', 'Assistant Professor', 2, 98765432, 5, 110),
(10, 'Michael', NULL, 'Nguyen', 'michael.nguyen@ubc.ca', '250-555-3456', 'EME', '345', 'Associate Professor', 3, 19283746, 12, 90),
(11, 'Olivia', 'Marie', 'Rodriguez', 'olivia.rodriguez@ubc.ca', '250-555-7890', 'ASC', '456', 'Assistant Professor', 4, 29384756, 8, 100),
(12, 'Daniel', NULL, 'Taylor', 'daniel.taylor@ubc.ca', '250-555-1122', 'SCI', '124', 'Lecturer', 1, 39485766, 3, 120),
(13, 'Sophia', 'Anne', 'Wilson', 'sophia.wilson@ubc.ca', '250-555-3344', 'ART', '235', 'Sessional Lecturer', 2, 49586776, 1, 80),
(14, 'William', NULL, 'Anderson', 'william.anderson@ubc.ca', '250-555-5566', 'EME', '346', 'Professor of Teaching', 3, 59687786, 6, 95),
(15, 'Ava', NULL, 'Martinez', 'ava.martinez@ubc.ca', '250-555-7788', 'ASC', '457', 'Professor Emeritus', 4, 69788796, 0, 0),
(16, NULL, NULL, 'Wilson', 'carol.wilson@maintenance.ca', '250-555-4321', NULL, NULL, 'Admin', NULL, NULL, 0, 0); 

-- Image 
-- INSERT INTO Image (imageId, fileType, image_data) VALUES
-- (1, 'jpg', '...'),
-- (2, 'png', '...');

-- Account (remember to hash passwords in a real system!)
INSERT INTO public."Account" ("accountId", "profileId", "email", "password", "isActive") VALUES
(1, 1, 'john.doe@ubc.ca', 'p@55word_1', true),
(2, 2, 'jane.smith@ubc.ca', 'p@55word_2', true),
(3, 3, 'robert.brown@ubc.ca', 'p@55word_3', true),
(4, 4, 'emily.davis@ubc.ca', 'p@55word_4', false),
(5, 5, 'alice.johnson@ubc.ca', 'p@55word_5', true),
(6, 6, 'bob.lee@ubc.ca', 'p@55word_6', true),
(7, 7, 'carol.wilson@maintenance.ca', 'p@55word_7', true),
(8, 8, 'david.kim@ubc.ca', 'p@55word_8', true),
(9, 9, 'sarah.chen@ubc.ca', 'p@55word_9', true),
(10, 10, 'michael.nguyen@ubc.ca', 'p@55word_10', true),
(11, 11, 'olivia.rodriguez@ubc.ca', 'p@55word_11', true),
(12, 12, 'daniel.taylor@ubc.ca', 'p@55word_12', true),
(13, 13, 'sophia.wilson@ubc.ca', 'p@55word_13', true),
(14, 14, 'william.anderson@ubc.ca', 'p@55word_14', true),
(15, 15, 'ava.martinez@ubc.ca', 'p@55word_15', true),
(16, 16, 'carol.wilson@maintenance.ca', 'p@55word_16', true);

-- AccountType (assuming 1 = Department Head, 2 = Department Staff, 3 = Instructor, 4 = Admin)
INSERT INTO public."AccountType" ("accountId", "accountType") VALUES
(1, 1), (1, 2), -- John: Department Head, Instructor
(2, 3),         -- Jane: Instructor
(3, 3),         -- Robert: Instructor
(4, 3),         -- Emily: Instructor
(5, 2),         -- Alice: Department Staff
(6, 2),         -- Bob: Department Staff
(7, 4),         -- Carol: Admin
(8, 3), (8, 4), -- David Kim: Instructor, Admin
(9, 3),         -- Sarah Chen: Instructor
(10, 3),        -- Michael Nguyen: Instructor
(11, 2),        -- Olivia Rodriguez: Department Staff
(12, 3),        -- Daniel Taylor: Instructor
(13, 3),        -- Sophia Wilson: Instructor
(14, 2),        -- William Anderson: Department Staff
(15, 3),        -- Ava Martinez: Instructor
(16, 4);        -- Carol Wilson: Admin

-- ServiceRole
INSERT INTO public."ServiceRole" ("serviceRoleId", "stitle", "description", "isActive", "divisionId") VALUES
(1, 'Undergraduate Advisor', 'Advises undergraduate students on academic matters.', true, 1),
(2, 'Graduate Admissions', 'Reviews and evaluates graduate program applications.', true, 1),
(3, 'Curriculum Committee', 'Develops and reviews curriculum proposals.', true, 2),
(4, 'Outreach Coordinator', 'Coordinates outreach activities to promote the department.', true, 3),
(5, 'Safety Committee Member', 'Ensures the safety of students, faculty, and staff in labs and facilities.', true, 4),
(6, 'Equity, Diversity, and Inclusion Committee', 'Promotes inclusivity and diversity within the department.', true, 1),
(7, 'Seminar Series Organizer', 'Organizes and manages the department''s seminar series.', true, 2),
(8, 'Awards Committee Member', 'Reviews and selects recipients for departmental awards and scholarships.', true, 3),
(9, 'Undergraduate Research Coordinator', 'Coordinates undergraduate research opportunities.', true, 1),
(10, 'Graduate Program Director', 'Oversees the graduate program.', true, 2);

-- ServiceRoleByYear
INSERT INTO public."ServiceRoleByYear" ("serviceRoleId", "year", "JANHour", "FEBHour", "MARHour", "APRHour", "MAYHour", "JUNHour", "JULHour", "AUGHour", "SEPHour", "OCTHour", "NOVHour", "DECHour") VALUES
(1, 2023, 4, 4, 4, 4, 4, 0, 0, 0, 4, 4, 4, 4),  -- Undergraduate Advisor 2023
(1, 2024, 5, 5, 5, 5, 5, 0, 0, 0, 5, 5, 5, 5),  -- Undergraduate Advisor 2024
(2, 2023, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2),  -- Graduate Admissions 2023
(2, 2024, 3, 3, 3, 3, 3, 0, 0, 0, 3, 3, 3, 3),  -- Graduate Admissions 2024
(3, 2023, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3),  -- Curriculum Committee 2023
(3, 2024, 4, 4, 4, 4, 4, 0, 0, 0, 4, 4, 4, 4),  -- Curriculum Committee 2024
(4, 2023, 10, 10, 10, 10, 10, 10, 0, 0, 10, 10, 10, 10),  -- Outreach Coordinator 2023
(4, 2024, 12, 12, 12, 12, 12, 0, 0, 0, 12, 12, 12, 12),  -- Outreach Coordinator 2024
(5, 2023, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2),  -- Safety Committee Member 2023
(5, 2024, 3, 3, 3, 3, 3, 0, 0, 0, 3, 3, 3, 3),  -- Safety Committee Member 2024
(6, 2023, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1),  -- Equity, Diversity, and Inclusion Committee 2023
(6, 2024, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2);  -- Equity, Diversity, and Inclusion Committee 2024

-- ServiceRoleAssignment
INSERT INTO public."ServiceRoleAssignment" ("profileId", "serviceRoleId", "year") VALUES
(1, 1, 2023),  -- John Doe: Undergraduate Advisor 2023
(1, 1, 2024),  -- John Doe: Undergraduate Advisor 2024
(2, 5, 2023),  -- Jane Smith: Safety Committee Member 2023
(2, 3, 2024),  -- Jane Smith: Curriculum Committee 2024
(2, 7, 2024),  -- Jane Smith: Seminar Series Organizer 2024
(3, 1, 2024),  -- Robert Brown: Undergraduate Advisor 2024
(3, 5, 2024),  -- Robert Brown: Safety Committee Member 2024
(3, 4, 2023),  -- Robert Brown: Outreach Coordinator 2023
(3, 8, 2023);  -- Robert Brown: Awards Committee Member 2023

-- Course
INSERT INTO public."Course" ("courseId", "ctitle", "description", "divisionId", "courseNum") VALUES
-- COSC
(1, 'Computer Programming I', 'Introduction to the design, implementation, and understanding of computer programs. Topics include problem solving, algorithm design, and data and procedural abstraction, with emphasis on the development of working programs.', 1, 111),
(2, 'Computer Programming II', 'Advanced programming in the application of software engineering techniques to the design and implementation of programs manipulating complex data structures.', 1, 121),
(3, 'Machine Architecture', 'Organization and design of computer systems and their impact on the practice of software development. Instruction set architecture and assembly programming languages, design of central processing units (CPU), memory hierarchy and cache organization, input and output programming.', 1, 211),
(4, 'Discrete Structures in Computing', 'Discrete structures in computing and relevant mathematical techniques. Logic and applications in automated reasoning and programming; proof techniques and analysis of algorithms and computation models; graph theory and graph models in computing; counting principles and discrete probability.', 1, 221),
(5, 'Data Structures', 'Introduction to the design, implementation and analysis of data structures. Topics will include lists, stacks, queues, trees, and graphs.', 1, 222),
(6, 'Introduction to Data Analytics', 'Software development and techniques for computation, analysis, and visualization of data. Manipulation of small and large data sets. Automation using scripting.', 1, 301),
(7, 'Numerical Analysis', 'Numerical techniques for basic mathematical processes and their analysis. Taylor polynomials, root-finding, linear systems, eigenvalues, approximating derivatives, locating minimizers, approximating integrals, solving differential equations.', 1, 303),
(8, 'Introduction to Databases', 'Databases from a user''s perspective: querying with SQL, designing with UML, and using programs to analyze data. Construction of database-driven applications and websites and experience with current database technologies.', 1, 304),
(9, 'Project Management', 'Examine tools and techniques to complete projects successfully, and within budget. Topics include Program Evaluation and Review Technique (PERT) and Critical Path Methods (CPM), and project management software.', 1, 305),
(10, 'Software Engineering', 'Techniques to construct large systems using fundamental activities of specification, design, implementation, testing, and maintenance. Various life cycle models, exposure to software development tools, modelling techniques, good development practices, and project management.', 1, 310),
(11, 'Introduction to Operating Systems', 'Introduction to batch, multiprogramming, and time-sharing systems. Process synchronization and communication. Main memory allocation techniques including virtual memory; process scheduling; deadlock avoidance and prevention; file organization and device management.', 1, 315),
(12, 'Analysis of Algorithms', 'Design and analysis of algorithms, illustrated from various problem areas. Models of computation, choice of data structures, space and time efficiency, computation complexity, algorithms for searching, sorting and graph-theoretic problems, NP-complete problems.', 1, 320),
(13, 'Introduction to Artificial Intelligence', 'AI and intelligent agents; state space search; game playing agents; logic and knowledge-based agents; constraint programming; planning; reasoning and decision making under uncertainty; machine learning; natural language understanding.', 1, 322),
(14, 'Introduction to Networks', 'The five-layer Internet architecture using TCP/IP: application, transport, network, link, and physical. Topics include web protocols, network programming, routing, addressing, congestion control, error handling, Ethernet, wireless networks, security, multimedia transmission, and network management.', 1, 328),
(15, 'Learning Analytics', 'Introduction to data analytics and machine learning techniques in the context of educational data. Focuses on user profiling, collaborative filtering, clustering, Bayesian user modeling, preference elicitation, and plagiarism detection.', 1, 329),
(16, 'Introduction to Medical Imaging and Imaging Informatics', 'Fundamental image analysis techniques. Image creation, manipulation, optimization, and analysis to aid in the diagnosis and treatment of human health conditions. Generation and display of X-ray, CT, MRI, Ultrasound and Nuclear Medicine images. Imaging Informatics and its place in the Electronic Medical Record.', 1, 335),
(17, 'Human Computer Interaction', 'History of human-computer interaction. Basic design principles, user-centered design, user task analysis, interaction models, input and output devices, graphical interface design, prototyping, and evaluation.', 1, 341),
(18, 'Image Processing and Applications', 'Fundamental theoretical and practical concepts for processing and analyzing real-world digital images and videos, image enhancement and filtering, frequency domain and other transform analysis, morphological image operations, image segmentation, and object recognition.', 1, 344),
(19, 'Web Programming', 'Design and implementation of web-based information systems and app development. Rich user interfaces, asynchronous updates, client-side and server-side scripting using standard technologies such as HTML, CSS, SVG, JavaScript, PHP. Data manipulation with SQL, JSON, XML. Modern scripting frameworks and libraries.', 1, 360),
(20, 'Database System Implementation', 'Fundamental concepts in constructing database systems including file organizations, storage management, system architectures, query processing/optimization, transaction management, recovery, and concurrency control. Additional topics may include distributed databases, mobile databases, and integration.', 1, 404),
(21, 'Modelling and Simulation', 'Numeric dynamic systems models and emphasis on discrete stochastic systems. State description of models, common model components, entities. Common simulation language. Simulation using algebraic languages. Simulation methodology: data collection, model design, output analysis, optimization, validation. Elements of queuing theory, relationship to simulation. Applications to computer systems models.', 1, 405),
(22, 'Numerical Optimization', 'Formulation and analysis of algorithms for continuous optimization problems; linear, quadratic, semi-definite, nonlinear (constrained and unconstrained), convex (smooth and non-smooth) optimization; large-scale problems; software packages and their implementation; elements of duality theory.', 1, 406),
(23, 'Introduction to Parallel Computing', 'Design and implementation of parallel programs including theoretical computer models, parallel architectures (distributed, multicore, GPU), and standard parallel libraries.', 1, 407),
(24, 'Computer Graphics', 'Human vision and colour, modelling, geometric transformations, algorithms for 2-D and 3-D graphics, hardware and system architectures, shading and lighting, animation.', 1, 414),
(25, 'Network Science', 'Graphs and complex networks in scientific research. Probabilistic and statistical models. Structures, patterns, and behaviors in networks. Algorithmic and statistical methods (online/mobile), social networks, and social media platforms. Social influence, information diffusion, and viral marketing. Sentiment analysis and opinion mining. Data privacy. Search engines and recommendation systems.', 1, 421),
(26, 'Advanced Human Computer Interaction', 'Computer interaction design principles, advanced methodologies and theories; novel interfaces and platforms, conceptualization from ideation to implementation, advanced techniques for evaluation including controlled quantitative evaluation, field evaluation, quantitative analysis; introduction to HCI research.', 1, 441),
(27, 'Computer Vision', 'Advanced vision methods that enable machines to analyze and understand images. Fundamental problems in computer vision and the state-of-the-art approaches that address them. Feature detection and matching, geometric and multi-view vision, structure from X, segmentation, object tracking and visual recognition, and deep learning methods.', 1, 444),
(28, 'Capstone Software Engineering Project', 'A capstone project requiring team software development for an actual client. Students must produce a comprehensive report and deliver a formal presentation.', 1, 499),
-- MATH
(29, 'Integral Calculus with Applications to Physical Sciences and Engineering', 'Definite integral, integration techniques, applications, modelling, linear ODE''s.', 2, 101),
(30, 'Calculus III', 'Analytic geometry in two and three dimensions, partial and directional derivatives, chain rule, maxima and minima, second derivative test, Lagrange multipliers, multiple integrals with applications.', 2, 200),
(31, 'Mathematical Proof', 'Sets and functions; induction; cardinality; properties of the real numbers; sequences, series, and limits. Logic, structure, style, and clarity of proofs emphasized throughout.', 2, 220),
(32, 'Matrix Algebra', 'Systems of linear equations, operations on matrices, determinants, eigenvalues and eigenvectors, diagonalization of symmetric matrices, and vector geometry.', 2, 221),
(33, 'Linear Algebra', 'Vector spaces, linear maps, change of basis, eigenvalues and eigenvectors, Jordan canonical forms, matrix decomposition, inner product spaces, orthogonality, linear operators.', 2, 223),
(34, 'Introduction to Differential Equations', 'First-order equations, initial value problems, existence and uniqueness theorems, second-order linear equations, superposition of solutions, independence, general solutions, non-homogeneous equations, phaseplane analysis, numerical methods, matrix methods for linear systems, and applications of differential equations to the physical, biological, and social sciences.', 2, 225),
(35, 'Applied Linear Algebra', 'LU-factorization, iterative estimates for eigenvalues, dynamical systems, orthogonality, QR-factorization, and applications of linear algebra.', 2, 307),
(36, 'Euclidean Geometry', 'Classical Euclidean, finite, modern, transformation geometry, and non-Euclidean geometry.', 2, 308),
(37, 'Abstract Algebra I', 'Properties of integers, the integers modulo n, groups, subgroups, cyclic groups, permutation groups, linear groups, quotient groups and homomorphisms, isomorphism theorems, direct products, and an introduction to rings and fields.', 2, 311),
(38, 'Introduction to Number Theory', 'Divisibility of integers, congruences, Euler''s Theorem, primitive roots, quadratic reciprocity, special Diophantine equations, distributions of primes.', 2, 312),
(39, 'Calculus IV', 'Parametrizations, inverse and implicit functions, integrals with respect to length and area; grad, div, and curl, and theorems of Green, Gauss, and Stokes.', 2, 317),
(40, 'Introduction to Partial Differential Equations', 'Methods of separation of variable, Fourier series, heat, wave and Laplace''s equations, boundary value problems, eigenfunction expansions, and Sturm-Liouville problems.', 2, 319),
(41, 'Applied Abstract Algebra', 'Congruences and groups, introduction to rings and fields, and topics chosen from: lattices, Boolean algebra and applications, balanced incomplete block designs, introduction to cryptography, applications to group theory.', 2, 323),
(42, 'Analysis I', 'The real number system, real Euclidean n-space; open, closed, compact, and connected sets; Bolzano-Weierstrass theorem; sequences and series; continuity and uniform continuity; differentiability and mean-value theorems; Riemann or Riemann-Stieltjes integrals.', 2, 327),
(43, 'Analysis II', 'Metric and normed vector spaces; limits in normed vector spaces, compactness; sequences and series of functions, approximation of continuous functions by polynomials; functions from Rm to Rn, inverse and implicit function theorems.', 2, 328),
(44, 'Abstract Algebra II', 'Covers properties of rings and fields, factorization, polynomials over a field, field extensions, field isomorphisms and automorphism, group of automorphisms, and Galois theory of unsolvability.', 2, 330),
(45, 'Introduction to Dynamical Systems', 'Non-linear systems and iteration of functions; flows, phase portraits, periodic orbits, chaotic attractors, fractals, and invariant sets.', 2, 339),
(46, 'Introduction to Linear Programming', 'Linear programming problems, dual problems, the simplex algorithm, solution of primal and dual problems, sensitivity analysis. Additional topics chosen from: Karmarkar''s algorithm, non-linear programming, game theory, applications.', 2, 340),
(47, 'Complex Variables and Applications', 'Covers analytic functions, Cauchy-Riemann equations, power series, Laurent series, elementary functions, contour integrals, and poles and residues. Introduction to conformal mapping and applications of analysis to problems in physics and engineering.', 2, 350),
(48, 'Differential Geometry', 'Local theory of curves, Frenet-Serret apparatus, fundamentals of the Gaussian theory of surface, normal curvature, geodesics, Gaussian and mean curvatures, theorema egregium, an introduction to Riemannian geometry, Gauss-Bonnet Theorem, and applications.', 2, 408),
(49, 'Mathematics of Financial Derivatives', 'Pricing theory of financial derivative securities. Options and markets, present and future values, price movement modeled by Brownian motion, Ito''s formula, parbolic partial differential equations, Black-Scholes model. Prices of European options as solutions of initial/boundary value problems for heat equations, American options, free boundary problems.', 2, 409),
(50, 'Introduction to General Topology', 'General (point-set) topology. Naive set theory, relations and functions, order relations, cardinality, Axiom of Choice, well-ordering, topological spaces, bases, subspaces, product spaces, limit points, continuous functions, homeomorphisms, metric spaces, connectedness, compactness, countability axioms, separation axioms, Urysohn lemma, Tietze extension theorem, Urysohn metrization theorem, Tychonoff theorem.', 2, 410),
(51, 'Real Analysis', 'Lebesgue measure, measurable functions, integration, convergence theorems, Lp spaces, Holder and Minkowski inequalities, Lebesgue-Radon-Nikodym theorem, Lebesgue differentiation.', 2, 427),
(52, 'Functional Analysis', 'Banach spaces, linear operators, bounded and compact operators, strong, weak, and weak* topology. Hahn-Banach, open mapping, and closed graph theorems. Hilbert spaces, symmetric and self-adjoint operators, spectral theory for bounded operators. ', 2, 428),
(53, 'Graph Theory', 'Introductory course in mostly non-algorithmic topics. Planarity and Kuratowski''s theorem, graph colouring, graph minors, random graphs, cycles in graphs, Ramsey theory, extremal graph theory. Proofs emphasized.', 2, 443),
(54, 'Mathematical Biology', 'Mathematical modelling in biological disciplines such as population dynamics, ecology, pattern formation, tumour growth, immune response, biomechanics, and epidemiology. Theory of such models formulated as difference equations, ordinary differential equations, and partial differential equations.', 2, 459),
(55, 'Continuous Optimization', 'Convex analysis, non-smooth optimization, Karush-Kuhn-Tucker theorem, iterative methods.', 2, 461),
-- PHYS
(56, 'Introductory Physics for the Physical Sciences I', 'Mechanics primarily for students majoring in the physical sciences (e.g. physics, chemistry, mathematics, computer science, geology, physical geography) or engineering. Particle kinematics and dynamics, work and energy, momentum, gravitation, rigid body motion, fluid statics and dynamics with applications to the physical sciences.', 3, 111),
(57, 'Introductory Physics for the Life Sciences I', 'Mechanics primarily for students majoring in the life sciences (e.g. biochemistry, biology, microbiology, pharmacy, human kinetics, human geography or psychology). Particle kinematics and dynamics, work and energy, momentum, gravitation, rigid body motion, fluid statics and dynamics with applications to the biological sciences.', 3, 112),
(58, 'Introductory Physics for the Physical Sciences II', 'Physics primarily for students majoring in the physical sciences. Simple harmonic motion, sound, physical and wave optics, electricity, electric circuits, and magnetism with applications to the physical sciences. Experimental laboratory investigations in electricity, magnetism, waves and optics.', 3, 121),
(59, 'Introductory Physics for the Life Sciences II', 'Physics primarily for students majoring in the life sciences. Simple harmonic motion, sound, physical and wave optics, electricity, electric circuits, and magnetism with biological applications. Experimental laboratory investigations in electricity, magnetism, waves and optics.', 3, 123),
(60, 'Relativity and Quanta', 'Special relativity: Lorentz transformation, dynamics, and conservation laws. Quantum physics: the experimental evidence for quantization; a qualitative discussion of the concepts of quantum mechanics and their application to simple systems of atoms and nuclei.', 3, 200),
(61, 'Thermodynamics', 'Thermodynamics at an intermediate level. Temperature, heat and work, the First Law, heat transfer, heat engines, entropy, and the Second Law.', 3, 215),
(62, 'Mechanics I', 'Review of kinematics, Newton''s laws, angular momentum, and fixed axis rotation. Rigid body motion, central forces, non-inertial frames of reference.', 3, 216),
(63, 'Intermediate Electricity and Magnetism', 'Electrostatics, Gauss'' law, electric potential, DC circuits, conduction models, strain gauges, RTD, circuit analysis theorems, magnetic fields, Hall effect, Ampere''s law, Faraday''s law, inductance, and semiconductors with basic applications.', 3, 225),
(64, 'Introduction to Electronics', 'Design and analysis of analog AC circuits, digital circuits, and analog-to-digital conversion methods. Basic physics laboratory skills including data collection, presentation of results, and analysis of uncertainties.', 3, 231),
(65, 'Modern Physics Laboratory', 'Selected experiments in relativity, quantum mechanics, thermodynamics, particle physics or nuclear physics. Quantitative analysis of data, methods of measurement, formal presentation of laboratory results.', 3, 232),
(66, 'Electricity and Magnetism', 'Electric fields and potentials of static charge distributions, current, fields of moving charges, magnetic field, electromagnetic induction, Maxwell''s equations.', 3, 301),
(67, 'Introduction to Quantum Mechanics', 'The beginnings of quantum mechanics, wave mechanics and the Schroedinger equation, one-dimensional potentials, the postulates of quantum mechanics, and applications to three-dimensional systems.', 3, 304),
(68, 'Introduction to Biophysics', 'Analysis of biological systems from a physicist''s perspective. Introduction to physics underlying biological phenomena, and range of applicability of simple physical principles. Form and size in animals, strength and energy storage in structural elements, thermal regulation, fluid motion within organisms, life in fluids, and molecular physics topics.', 3, 305),
(69, 'Introduction to Medical Physics', 'Radiation interactions with matter; use of ionizing and non-ionizing radiation to diagnose and treat disease; radiation dosimetry; introduction to radiobiology; radiation effects in healthy and tumour tissue; radiation protection; medical imaging in radiation therapy.', 3, 310),
(70, 'Fluids', 'Kinetic theory: diffusion, viscosity, and sound waves. Introduction to hydrodynamics: Laminar flow, capillary and gravity waves, convection, and turbulence. Dimensional analysis.', 3, 314),
(71, 'Environmental Physics', 'Contemporary environmental issues: physics of climate modification, ozone depletion, energy sources for electrical generation, energy storage, energy conservation strategies, transportation, pollutant transport, non-ionizing radiation, risk analysis, and other current topics of interest.', 3, 320),
(72, 'Waves', 'Intermediate treatment of wave production, propagation, reception. Acoustics, electrical transmission lines, electromagnetics, scalar wave equation. Finite difference time domain computer simulation, boundary conditions, normal modes, input impedance, energy density, power flux/propagation across boundaries at normal and oblique incidence, sonic transducers, alternating current sources, and antennae.', 3, 324),
(73, 'Advanced Mechanics', 'Variational calculus, the Lagrangian Method applied to a variety of problems, weak anharmonic perturbations of normal-mode systems, Hamilton''s equations of motion, phase space, Liouville''s theorem, chaos in Hamiltonian systems, rigid-body rotations in three dimensions, Lagrangian formulation of relativistic mechanics, and the Virial theorem.', 3, 328),
(74, 'Experimental Physics I', 'Selected advanced physics experiments in solid-state physics, fluid dynamics, particle physics, astrophysics, optics, nonlinear dynamics or electromagnetism. Experimental design, construction, and formal presentation of results.', 3, 331),
(75, 'Introduction to Elementary Particles', 'Standard model, classification of elementary particles and forces of nature, symmetries, conservation laws, quark model, quantum electrodynamics, quantum chromodynamics, and the theory of weak interactions.', 3, 400),
(76, 'Electromagnetic Theory', 'The application of Maxwell''s theory to the propagation of electromagnetic waves.', 3, 401),
(77, 'Advanced Quantum Mechanics', 'Quantum mechanical methods and concepts emphasizing operator algebra approaches. Commutation relations; quantum dynamics; approximation methods including stationary-state and time-dependent perturbation theory; interaction of radiation with matter; identical particles.', 3, 402),
(78, 'Introduction to General Relativity', 'Ensemble theory, application to classical and quantum gases, and Boltzmann equation. Principles and applications of statistical mechanics. Ideal gases, degenerate Fermi gases, Bose-Einstein condensation, black body radiation, fluctuations and phase transitions.', 3, 403),
-- STAT
(79, 'Elementary Statistics', 'Descriptive and inferential statistics, elementary probability, probability distributions, estimation of parameters, hypotheses testing, correlation, linear regression.', 4, 121),
(80, 'Introduction to Probability', 'Combinatorics. Axioms of probability. Discrete and continuous random variables, expectation, and variance. Transformations. Central limit theorem and applications. Weak law of large numbers.', 4, 203),
(81, 'Introduction to Mathematical Statistics', 'Sampling distribution theory. Likelihood. Parameter estimation. Confidence intervals and hypothesis testing; simple regression, analysis of variance and contingency table analysis.', 4, 205),
(82, 'Introductory Statistics', 'Applied statistics for students with a first-year calculus background. Estimation and testing of hypotheses, problem formulation, models and basic methods in analysis of variance, linear regression, and non-parametric methods. Descriptive statistics and probability are presented as a basis for such procedures.', 4, 230),
(83, 'Intermediate Probability', 'Multivariate probability distributions, moment and generating functions.', 4, 303),
(84, 'Mathematical Finance', 'Simple and compound interest, discount, force of interest, simple and general annuities, amortization of debts, bonds, depreciation, mortality tables, contingent payments, life annuities, insurance, and an introduction to financial derivatives.', 4, 324),
(85, 'Probability and Statistical Inference', 'Theory of statistical modelling: distributions of data, likelihood-based inference for learning unknown parameters, construction of confidence intervals and development of tests. Bayesian methods will be used to contrast standard statistical procedures.', 4, 401),
(86, 'Stochastic Processes', 'Random walks, Markov chains, Poisson processes, continuous time Markov chains, birth and death processes, exponential models, and applications of Markov chains.', 4, 403),
(87, 'Environmetrics', 'Statistical concepts and methods in environmental science and management. Scientific problem-solving using statistical methods. Integration of the formulation of objectives, study design, and quantitative methods appropriate for the design. The role and use of statistical software packages.', 4, 406);

-- CourseByTerm (Ex. 2024W1 = 20241, 2024W2 = 20242, 2024S1 = 20243, 2024S2 = 20244)
INSERT INTO public."CourseByTerm" ("courseId", "term") VALUES
(1, 20241),     -- Computer Programming I, Winter 2024 Term 1
(2, 20241),     -- Computer Programming II, Winter 2024 Term 1
(3, 20243),     -- Machine Architecture, Summer 2024 Term 1
(4, 20231),     -- Discrete Structures in Computing, Winter 2023 Term 1 
(5, 20242),     -- Data Structures, Winter 2024 Term 2
(6, 20241),     -- Introduction to Data Analytics, Winter 2024 Term 1
(7, 20241),     -- Numerical Analysis, Summer 2024 Term 2
(8, 20231),     -- Introduction to Databases, Winter 2023 Term 1
(9, 20233),     -- Project Management, Spring 2023 Term 1
(9, 20234),     -- Project Management, Summer 2023 Term 2
(10, 20234),    -- Software Engineering, Summer 2023 Term 2
(11, 20232),    -- Introduction to Operating Systems, Winter 2023 Term 2
(12, 20233),    -- Analysis of Algorithms, Spring 2023 Term 1
(14, 20234),    -- Introduction to Networks, Summer 2023 Term 2
(17, 20242),    -- Human Computer Interaction, Winter 2024 Term 2
(19, 20233),    -- Web Programming, Spring 2023 Term 1
(22, 20241),    -- Numerical Optimization, Winter 2024 Term 1
(25, 20234),    -- Network Science, Summer 2023 Term 2
(28, 20243),    -- Differential Calculus with Applications to Physical Sciences and Engineering, Summer 2024 Term 1
(33, 20242),    -- Linear Algebra, Winter 2024 Term 2
(37, 20231),    -- Abstract Algebra I, Winter 2023 Term 1
(40, 20233),    -- Introduction to Partial Differential Equations, Spring 2023 Term 1
(56, 20232),    -- Introductory Physics for the Physical Sciences I, Winter 2023 Term 2
(58, 20241),    -- Introductory Physics for the Physical Sciences II, Winter 2024 Term 1
(63, 20243),    -- Intermediate Electricity and Magnetism, Summer 2024 Term 1
(66, 20234),    -- Electricity and Magnetism, Summer 2023 Term 2
(71, 20232),    -- Environmental Physics, Winter 2023 Term 2
(79, 20242),    -- Elementary Statistics, Winter 2024 Term 2
(82, 20243),    -- Introductory Statistics, Summer 2024 Term 1
(85, 20231),    -- Probability and Statistical Inference, Winter 2023 Term 1
(1, 20244),    -- Computer Programming I, Summer 2024 Term 2
(2, 20244),    -- Computer Programming II, Summer 2024 Term 2
(3, 20244),    -- Machine Architecture, Summer 2024 Term 2
(4, 20244),    -- Discrete Structures in Computing, Summer 2024 Term 2
(5, 20244),    -- Data Structures, Summer 2024 Term 2
(6, 20244),    -- Introduction to Data Analytics, Summer 2024 Term 2
(7, 20244),    -- Numerical Analysis, Summer 2024 Term 2
(8, 20244),    -- Introduction to Databases, Summer 2024 Term 2
(9, 20244),    -- Project Management, Summer 2024 Term 2
(10, 20244),   -- Software Engineering, Summer 2024 Term 2
(11, 20244),   -- Introduction to Operating Systems, Summer 2024 Term 2
(12, 20244),   -- Analysis of Algorithms, Summer 2024 Term 2
(13, 20244),   -- Introduction to Artificial Intelligence, Summer 2024 Term 2
(14, 20244),   -- Introduction to Networks, Summer 2024 Term 2
(15, 20244),   -- Learning Analytics, Summer 2024 Term 2
(16, 20244),   -- Introduction to Medical Imaging and Imaging Informatics, Summer 2024 Term 2
(17, 20244),   -- Human Computer Interaction, Summer 2024 Term 2
(18, 20244),   -- Image Processing and Applications, Summer 2024 Term 2
(19, 20244),   -- Web Programming, Summer 2024 Term 2
(20, 20244),   -- Database System Implementation, Summer 2024 Term 2
(21, 20244),   -- Modelling and Simulation, Summer 2024 Term 2
(22, 20244),   -- Numerical Optimization, Summer 2024 Term 2
(23, 20244),   -- Introduction to Parallel Computing, Summer 2024 Term 2
(24, 20244),   -- Computer Graphics, Summer 2024 Term 2
(25, 20244),   -- Network Science, Summer 2024 Term 2
(26, 20244),   -- Advanced Human Computer Interaction, Summer 2024 Term 2
(27, 20244),   -- Computer Vision, Summer 2024 Term 2
(28, 20244),
(29, 20244),
(30, 20244),
(31, 20244),
(32, 20244),
(33, 20244),
(34, 20244),
(35, 20244),
(36, 20244),
(37, 20244),
(38, 20244),
(39, 20244),
(40, 20244),
(41, 20244),
(42, 20244),
(43, 20244),
(44, 20244),
(45, 20244),
(46, 20244),
(47, 20244),
(48, 20244),
(49, 20244),
(50, 20244),
(51, 20244),
(52, 20244),
(53, 20244),
(54, 20244),
(55, 20244),
(56, 20244),
(57, 20244),
(58, 20244),
(59, 20244),
(60, 20244),
(61, 20244),
(62, 20244),
(63, 20244),
(64, 20244),
(65, 20244),
(66, 20244),
(67, 20244),
(68, 20244),
(69, 20244),
(70, 20244),
(71, 20244),
(72, 20244),
(73, 20244),
(74, 20244),
(75, 20244),
(76, 20244),
(77, 20244),
(78, 20244),
(79, 20244),
(80, 20244),
(81, 20244),
(82, 20244),
(83, 20244),
(84, 20244),
(85, 20244),
(86, 20244),
(2, 20242),
(9, 20231),
(9, 20232);

-- InstructorTeachingAssignment
INSERT INTO public."InstructorTeachingAssignment" ("profileId", "courseId", "term") VALUES
(1, 1, 20241),     -- John Doe: Computer Programming I, Winter 2024 Term 1
(1, 2, 20242),     -- John Doe: Computer Programming II, Winter 2024 Term 2
(2, 4, 20231),     -- Jane Allison Smith: Discrete Structures in Computing, Winter 2023 Term 1 
(2, 5, 20242),     -- Jane Allison Smith: Data Structures, Winter 2024 Term 2
(3, 9, 20231),     -- Robert Brown: Project Management, Winter 2023 Term 1
(3, 9, 20232),     -- Robert Brown: Project Management, Winter 2023 Term 2
(8, 11, 20232),    -- David Kim: Introduction to Operating Systems, Winter 2023 Term 2
(9, 12, 20233),    -- Sarah Lee Chen: Analysis of Algorithms, Summer 2023 Term 1
(10, 14, 20234),   -- Michael Nguyen: Intro to Networks, Summer 2023 Term 2
(11, 17, 20242),   -- Olivia Marie Rodriguez: HCI, Winter 2024 Term 2
(12, 19, 20233),   -- Daniel Taylor: Web Programming, Summer 2023 Term 1
(13, 22, 20241),   -- Sophia Anne Wilson: Numerical Optimization, Winter 2024 Term 1
(14, 25, 20234),   -- William Anderson: Network Science, Summer 2023 Term 2
(15, 28, 20243),   -- Ava Martinez: Differential Calculus, Summer 2024 Term 1
(8, 33, 20242),    -- David Kim: Linear Algebra, Winter 2024 Term 2
(9, 37, 20231),    -- Sarah Lee Chen: Abstract Algebra I, Winter 2023 Term 1
(10, 40, 20233),   -- Michael Nguyen: Intro to PDEs, Summer 2023 Term 1
(11, 49, 20244),   -- Olivia Marie Rodriguez: Math of Financial Derivatives, Summer 2024 Term 2
(12, 56, 20232),   -- Daniel Taylor: Introductory Physics I, Winter 2023 Term 2
(13, 58, 20241),   -- Sophia Anne Wilson: Introductory Physics II, Winter 2024 Term 1
(14, 63, 20243),   -- William Anderson: Intermediate Electricity and Magnetism, Summer 2024 Term 1
(15, 66, 20234),   -- Ava Martinez: Electricity and Magnetism, Summer 2023 Term 2
(8, 71, 20232),    -- David Kim: Environmental Physics, Winter 2023 Term 2
(9, 79, 20242),    -- Sarah Lee Chen: Elementary Statistics, Winter 2024 Term 2
(10, 82, 20243),   -- Michael Nguyen: Introductory Statistics, Summer 2024 Term 1
(11, 85, 20231),   -- Olivia Marie Rodriguez: Probability and Statistical Inference, Winter 2023 Term 1 
(1, 28, 20244),    -- John Doe: Capstone Software Engineering Project, Summer 2024 Term 2
(1, 29, 20244),    -- John Doe: Integral Calculus with Applications to Physical Sciences and Engineering, Summer 2024 Term 2
(1, 30, 20244),    -- John Doe: Calculus III, Summer 2024 Term 2
(2, 27, 20244),    -- Jane Allison Smith: Computer Vision, Summer 2024 Term 2
(2, 31, 20244),    -- Jane Allison Smith: Mathematical Proof, Summer 2024 Term 2
(2, 32, 20244),    -- Jane Allison Smith: Matrix Algebra, Summer 2024 Term 2
(3, 25, 20244),    -- Robert Brown: Network Science, Summer 2024 Term 2
(3, 26, 20244),    -- Robert Brown: Advanced Human Computer Interaction, Summer 2024 Term 2
(3, 33, 20244),    -- Robert Brown: Linear Algebra, Summer 2024 Term 2
(4, 23, 20244),    -- Emily Davis: Introduction to Parallel Computing, Summer 2024 Term 2
(4, 24, 20244),    -- Emily Davis: Computer Graphics, Summer 2024 Term 2
(4, 34, 20244),    -- Emily Davis: Introduction to Differential Equations, Summer 2024 Term 2
(5, 20, 20244),    -- Alice Johnson: Database System Implementation, Summer 2024 Term 2
(5, 21, 20244),    -- Alice Johnson: Modelling and Simulation, Summer 2024 Term 2
(5, 35, 20244),    -- Alice Johnson: Applied Linear Algebra, Summer 2024 Term 2
(6, 19, 20244),    -- Bob Lee: Web Programming, Summer 2024 Term 2
(6, 22, 20244),    -- Bob Lee: Numerical Optimization, Summer 2024 Term 2
(6, 36, 20244),    -- Bob Lee: Euclidean Geometry, Summer 2024 Term 2
(8, 17, 20244),    -- David Kim: Human Computer Interaction, Summer 2024 Term 2
(8, 18, 20244),    -- David Kim: Image Processing and Applications, Summer 2024 Term 2
(8, 37, 20244),    -- David Kim: Abstract Algebra I, Summer 2024 Term 2
(9, 15, 20244),    -- Sarah Lee Chen: Learning Analytics, Summer 2024 Term 2
(9, 16, 20244),    -- Sarah Lee Chen: Introduction to Medical Imaging and Imaging Informatics, Summer 2024 Term 2
(9, 38, 20244),    -- Sarah Lee Chen: Introduction to Number Theory, Summer 2024 Term 2
(10, 13, 20244),   -- Michael Nguyen: Introduction to Artificial Intelligence, Summer 2024 Term 2
(10, 14, 20244),   -- Michael Nguyen: Introduction to Networks, Summer 2024 Term 2
(10, 39, 20244),   -- Michael Nguyen: Calculus IV, Summer 2024 Term 2
(11, 11, 20244),   -- Olivia Marie Rodriguez: Introduction to Operating Systems, Summer 2024 Term 2
(11, 12, 20244),   -- Olivia Marie Rodriguez: Analysis of Algorithms, Summer 2024 Term 2
(11, 40, 20244),   -- Olivia Marie Rodriguez: Introduction to Partial Differential Equations, Summer 2024 Term 2
(12, 9, 20244),    -- Daniel Taylor: Project Management, Summer 2024 Term 2
(12, 10, 20244),   -- Daniel Taylor: Software Engineering, Summer 2024 Term 2
(12, 41, 20244),   -- Daniel Taylor: Applied Abstract Algebra, Summer 2024 Term 2
(13, 7, 20244),    -- Sophia Anne Wilson: Numerical Analysis, Summer 2024 Term 2
(13, 8, 20244),    -- Sophia Anne Wilson: Introduction to Databases, Summer 2024 Term 2
(13, 42, 20244),   -- Sophia Anne Wilson: Analysis I, Summer 2024 Term 2
(14, 4, 20244),    -- William Anderson: Discrete Structures in Computing, Summer 2024 Term 2
(14, 5, 20244),    -- William Anderson: Data Structures, Summer 2024 Term 2
(14, 43, 20244),   -- William Anderson: Analysis II, Summer 2024 Term 2
(15, 1, 20244),    -- Ava Martinez: Computer Programming I, Summer 2024 Term 2
(15, 2, 20244),    -- Ava Martinez: Computer Programming II, Summer 2024 Term 2
(15, 45, 20244),   -- Ava Martinez: Introduction to Dynamical Systems, Summer 2024 Term 2
(1, 56, 20244),    -- John Doe: Introductory Physics for the Physical Sciences I, Summer 2024 Term 2
(2, 57, 20244),    -- Jane Allison Smith: Introductory Physics for the Life Sciences I, Summer 2024 Term 2
(3, 59, 20244),    -- Robert Brown: Introductory Physics for the Life Sciences II, Summer 2024 Term 2
(4, 60, 20244),    -- Emily Davis: Relativity and Quanta, Summer 2024 Term 2
(5, 61, 20244),    -- Alice Johnson: Thermodynamics, Summer 2024 Term 2
(6, 62, 20244),    -- Bob Lee: Mechanics I, Summer 2024 Term 2
(8, 64, 20244),    -- David Kim: Introduction to Electronics, Summer 2024 Term 2
(9, 65, 20244),    -- Sarah Lee Chen: Modern Physics Laboratory, Summer 2024 Term 2
(10, 68, 20244),   -- Michael Nguyen: Introduction to Biophysics, Summer 2024 Term 2
(11, 69, 20244),   -- Olivia Marie Rodriguez: Introduction to Medical Physics, Summer 2024 Term 2
(12, 70, 20244),   -- Daniel Taylor: Fluids, Summer 2024 Term 2
(13, 72, 20244),   -- Sophia Anne Wilson: Waves, Summer 2024 Term 2
(14, 73, 20244),   -- William Anderson: Advanced Mechanics, Summer 2024 Term 2
(15, 77, 20244),   -- Ava Martinez: Advanced Quantum Mechanics, Summer 2024 Term 2
(1, 79, 20244),    -- John Doe: Elementary Statistics, Summer 2024 Term 2
(2, 80, 20244),    -- Jane Allison Smith: Introduction to Probability, Summer 2024 Term 2
(14, 80, 20244);   -- William Anderson: Introduction to Probability, Summer 2024 Term 2

-- SurveyType (Assuming 1=SEI)
INSERT INTO public."SurveyType" ("surveyTypeId", "surveyType") VALUES
(1, 'SEI');

-- SurveyQuestion (Assuming 6 questions for SEI)
INSERT INTO public."SurveyQuestion" ("surveyTypeId", "surveyQuestionId", "description") VALUES
(1, 1, 'The instructor was well-prepared for class.'),
(1, 2, 'The instructor explained the material clearly.'),
(1, 3, 'The instructor was available for help outside of class.'),
(1, 4, 'The course assignments were valuable learning experiences.'),
(1, 5, 'The course workload was appropriate.'),
(1, 6, 'Overall, I would recommend this course to other students.');

-- SurveyQuestionResponse (Sample responses for John Doe's Calculus I)
INSERT INTO public."SurveyQuestionResponse" ("surveyTypeId", "surveyQuestionId", "courseId", "term", "profileId", "studentId", "response") VALUES
(1, 1, 1, 20241, 1, 55555555, '4'),  -- Rating scale 1-5
(1, 2, 1, 20241, 1, 55555555, '5'),
(1, 3, 1, 20241, 1, 55555555, '3'),
(1, 4, 1, 20241, 1, 55555555, '4'),
(1, 5, 1, 20241, 1, 55555555, '4'),
(1, 6, 1, 20241, 1, 55555555, 'Agree');

-- SingleTeachingPerformance
-- (Assuming you have some way to calculate the score)
INSERT INTO public."SingleTeachingPerformance" ("profileId", "courseId", "term", "score") VALUES
(1, 1, 20241, 4.2),
(2, 4, 20231, 4.5),
(3, 9, 20234, 3.8);