const API_URL = "http://127.0.0.1:8000/"

const ALERT_TIMEOUT = 3000

const COURSE_URL = {
    teacher: {
        course: {
            getSingle: API_URL + 'course/teacher/@cid/',
            get: API_URL + 'course/teacher/',
            post: API_URL + 'course/teacher/',
            put: API_URL + 'course/teacher/@cid/',
            delete: API_URL + 'course/teacher/@cid/',
            copyCourse: API_URL + '/course/teacher/copy/@cid/'
        },
        module: {
            get: API_URL + "module/teacher/@cid/",
            gitSingle: API_URL + "module/teacher/@cid/@mid/",
            delete: API_URL + "module/teacher/@cid/",
            post: API_URL + "module/teacher/@cid/",
            put: API_URL + "module/teacher/@cid/",
        },
        group: {
            url: API_URL + "group/teacher/@cid/",
            get: API_URL + "module/teacher/@cid/@gid/",
        },
        assignment: {
            get: API_URL + "assignment/teacher/@cid/",
            getSingle: API_URL + "assignment/teacher/@cid/@aid/",
            delete: API_URL + "assignment/teacher/@cid/",
            post: API_URL + "assignment/teacher/@cid/"
        },
        submission: {
            get: API_URL + "submission/teacher/@cid/@aid/@sid/",
            url: API_URL + "submission/teacher/@cid/@aid/"
        },
        grade: {
            url : API_URL + "grade/teacher/@cid/@aid/@sid/"
        },
        // get joined student details courses
        courseDetail: {
            get: API_URL + 'coursedetail/teacher/@cid/',
            post: API_URL + 'coursedetail/teacher/@cid/', // to accept / deny join request 
            delete: API_URL + 'coursedetail/teacher/@cid/',
        }
    },
    student:{
   
        // view modules 
        module: {
            get: API_URL + "module/student/@cid/",
        },
        // list of joined courses
        course: {
            get: API_URL + 'course/student/',
            getSingle: API_URL + 'course/student/@cid/',
        },
        // list of assignments
        assignment: {
            get: API_URL + "assignment/student/@cid/",
            getSingle: API_URL + "assignment/student/@cid/@aid/"
        },
        // get submitted data
        // post a new submission 
        submission: {
            get: API_URL + "submission/student/@cid/@aid/",
            post: API_URL + "submission/student/@cid/@aid/"
        },
        // get joined courses 
        // join / leave a course 
        courseDetail: {
            get: API_URL + 'coursedetail/student/',
            getSingle: API_URL + 'coursedetail/student/@cid/',
            post: API_URL + "coursedetail/student/"
        },

        grade: {
            get : API_URL + "grade/student/@cid/@aid/"
        }
    }
}

// const inputs = [
//     {type: "text", name: "name", colSpan: "col-span-1", label: "First Name", required: true, placeholder: "placeholder", id: "id" },
//     {type: "password", name: "name", colSpan: "col-span-1", label: "Last Name", required: true, placeholder: "placeholder", id: "id" },
//     {type: "file", name: "name", colSpan: "col-span-1", label: "Bio", required: true, placeholder: "placeholder", id: "id", accept:".jpg,.jpeg,.png" },
//     {type: "email", name: "name", colSpan: "col-span-1", label: "lable 4", required: true, placeholder: "placeholder", id: "id" },
//     {type: "select", name: "name", colSpan: "col-span-1", label: "lable 5", placeholder: "placeholder", id: "id", options: [{value: "one", selected: false},{value: "two", selected: false},{value: "three", selected: true},{value: "four", selected: false},] },
//     {type: "radio", name: "radiobutt", colSpan: "col-span-1", label: "Gender", placeholder: "placeholder", id: "id", cols: "grid-cols-4", options: [{value: "one", defaultChecked: true},{value: "two"},{value: "three"},{value: "four"}] },
//     {type: "editor", name: "name", colSpan: "col-span-2", label: "lable 6", placeholder: "placeholder", id: "id", resize: true, value: editorValue, onChange: setEditorValue},
//     {type: "submit", colSpan: "col-span-2", label: ""},
// ]

export {API_URL, COURSE_URL, ALERT_TIMEOUT}