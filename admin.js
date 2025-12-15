// admin.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Session Check
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // 2. DOM Elements
    const logoutBtn = document.getElementById('logoutBtn');

    // Tabs
    const tabStudents = document.getElementById('tabStudents');
    const tabActivities = document.getElementById('tabActivities');
    const studentsSection = document.getElementById('studentsSection');
    const activitiesSection = document.getElementById('activitiesSection');

    // Student Elements
    const studentTableBody = document.getElementById('studentTableBody');
    const studentEmptyState = document.getElementById('studentEmptyState');
    const addStudentBtn = document.getElementById('addStudentBtn');
    const studentModal = document.getElementById('studentModal');
    const closeStudentModal = document.getElementById('closeStudentModal');
    const cancelStudent = document.getElementById('cancelStudent');
    const studentForm = document.getElementById('studentForm');
    const disabilityFilter = document.getElementById('disabilityFilter');

    // Activity Elements
    const activityTableBody = document.getElementById('activityTableBody');
    const activityEmptyState = document.getElementById('activityEmptyState');
    const addActivityBtn = document.getElementById('addActivityBtn');
    const activityModal = document.getElementById('activityModal');
    const closeActivityModal = document.getElementById('closeActivityModal');
    const cancelActivity = document.getElementById('cancelActivity');
    const activityForm = document.getElementById('activityForm');

    // 3. Data Management (LocalStorage)
    const getStudents = () => JSON.parse(localStorage.getItem('students')) || [];
    const saveStudents = (students) => localStorage.setItem('students', JSON.stringify(students));

    const getActivities = () => JSON.parse(localStorage.getItem('activities')) || [];
    const saveActivities = (activities) => localStorage.setItem('activities', JSON.stringify(activities));

    // 4. Logout Logic
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    });

    // 5. Tab Switching Logic
    tabStudents.addEventListener('click', () => {
        tabStudents.classList.add('border-indigo-500', 'text-indigo-600');
        tabStudents.classList.remove('border-transparent', 'text-gray-500');

        tabActivities.classList.remove('border-indigo-500', 'text-indigo-600');
        tabActivities.classList.add('border-transparent', 'text-gray-500');

        studentsSection.classList.remove('hidden');
        activitiesSection.classList.add('hidden');
    });

    tabActivities.addEventListener('click', () => {
        tabActivities.classList.add('border-indigo-500', 'text-indigo-600');
        tabActivities.classList.remove('border-transparent', 'text-gray-500');

        tabStudents.classList.remove('border-indigo-500', 'text-indigo-600');
        tabStudents.classList.add('border-transparent', 'text-gray-500');

        activitiesSection.classList.remove('hidden');
        studentsSection.classList.add('hidden');
        renderActivities(); // Refresh activities when switching
    });

    // 6. Student CRUD
    const renderStudents = () => {
        const students = getStudents();
        const filter = disabilityFilter.value;
        const filteredStudents = students.filter(s => filter === 'all' || s.disability === filter);

        studentTableBody.innerHTML = '';

        if (filteredStudents.length === 0) {
            studentEmptyState.classList.remove('hidden');
        } else {
            studentEmptyState.classList.add('hidden');
            filteredStudents.forEach(student => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${student.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.age}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">${student.disability}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">${student.grade}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">${student.assistance === 'no' ? 'No' : 'Sí'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-indigo-600 hover:text-indigo-900 mr-3" onclick="editStudent('${student.id}')">Editar</button>
                        <button class="text-red-600 hover:text-red-900" onclick="deleteStudent('${student.id}')">Eliminar</button>
                    </td>
                `;
                studentTableBody.appendChild(tr);
            });
        }
    };

    const openStudentModal = (student = null) => {
        studentModal.classList.remove('hidden');
        if (student) {
            document.getElementById('studentModalTitle').innerText = 'Editar Estudiante';
            document.getElementById('studentId').value = student.id;
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentAge').value = student.age;
            document.getElementById('studentDisability').value = student.disability;
            document.getElementById('studentGrade').value = student.grade;
            document.getElementById('studentAssistance').value = student.assistance;
        } else {
            document.getElementById('studentModalTitle').innerText = 'Añadir Estudiante';
            studentForm.reset();
            document.getElementById('studentId').value = '';
        }
    };

    const closeStudentModalFunc = () => {
        studentModal.classList.add('hidden');
        studentForm.reset();
    };

    addStudentBtn.addEventListener('click', () => openStudentModal());
    closeStudentModal.addEventListener('click', closeStudentModalFunc);
    cancelStudent.addEventListener('click', closeStudentModalFunc);

    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('studentId').value;
        const newStudent = {
            id: id || Date.now().toString(),
            name: document.getElementById('studentName').value,
            age: document.getElementById('studentAge').value,
            disability: document.getElementById('studentDisability').value,
            grade: document.getElementById('studentGrade').value,
            assistance: document.getElementById('studentAssistance').value,
        };

        let students = getStudents();
        if (id) {
            const index = students.findIndex(s => s.id === id);
            if (index !== -1) students[index] = newStudent;
        } else {
            students.push(newStudent);
        }

        saveStudents(students);
        closeStudentModalFunc();
        renderStudents();
    });

    window.editStudent = (id) => {
        const student = getStudents().find(s => s.id === id);
        if (student) openStudentModal(student);
    };

    window.deleteStudent = (id) => {
        if (confirm('¿Estás seguro de eliminar este estudiante?')) {
            let students = getStudents().filter(s => s.id !== id);
            saveStudents(students);
            renderStudents();
        }
    };

    disabilityFilter.addEventListener('change', renderStudents);

    // 7. Activity CRUD
    const renderActivities = () => {
        const activities = getActivities();
        activityTableBody.innerHTML = '';

        if (activities.length === 0) {
            activityEmptyState.classList.remove('hidden');
        } else {
            activityEmptyState.classList.add('hidden');
            activities.forEach(activity => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${activity.title}</td>
                    <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${activity.description}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">${activity.difficulty}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-indigo-600 hover:text-indigo-900 mr-3" onclick="editActivity('${activity.id}')">Editar</button>
                        <button class="text-red-600 hover:text-red-900" onclick="deleteActivity('${activity.id}')">Eliminar</button>
                    </td>
                `;
                activityTableBody.appendChild(tr);
            });
        }
    };

    const openActivityModal = (activity = null) => {
        activityModal.classList.remove('hidden');
        if (activity) {
            document.getElementById('activityModalTitle').innerText = 'Editar Actividad';
            document.getElementById('activityId').value = activity.id;
            document.getElementById('activityTitle').value = activity.title;
            document.getElementById('activityDesc').value = activity.description;
            document.getElementById('activityDifficulty').value = activity.difficulty;
        } else {
            document.getElementById('activityModalTitle').innerText = 'Añadir Actividad';
            activityForm.reset();
            document.getElementById('activityId').value = '';
        }
    };

    const closeActivityModalFunc = () => {
        activityModal.classList.add('hidden');
        activityForm.reset();
    };

    addActivityBtn.addEventListener('click', () => openActivityModal());
    closeActivityModal.addEventListener('click', closeActivityModalFunc);
    cancelActivity.addEventListener('click', closeActivityModalFunc);

    activityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('activityId').value;
        const newActivity = {
            id: id || Date.now().toString(),
            title: document.getElementById('activityTitle').value,
            description: document.getElementById('activityDesc').value,
            difficulty: document.getElementById('activityDifficulty').value,
        };

        let activities = getActivities();
        if (id) {
            const index = activities.findIndex(a => a.id === id);
            if (index !== -1) activities[index] = newActivity;
        } else {
            activities.push(newActivity);
        }

        saveActivities(activities);
        closeActivityModalFunc();
        renderActivities();
    });

    window.editActivity = (id) => {
        const activity = getActivities().find(a => a.id === id);
        if (activity) openActivityModal(activity);
    };

    window.deleteActivity = (id) => {
        if (confirm('¿Estás seguro de eliminar esta actividad?')) {
            let activities = getActivities().filter(a => a.id !== id);
            saveActivities(activities);
            renderActivities();
        }
    };

    // Initial Render
    renderStudents();
});
