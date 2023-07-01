const API_URL = "http://127.0.0.1:8000/"

const ALERT_TIMEOUT = 3000

const COURSE_URL = {
    teacher: {
        course: {
            get: API_URL + 'course/teacher/@cid/',
            getAll: API_URL + 'course/teacher/',
            post: API_URL + 'course/teacher/',
            put: API_URL + 'course/teacher/@cid/',
            delete: API_URL + 'course/teacher/',
        },
        module: {
            url: API_URL + "module/teacher/@cid/",
            get: API_URL + "module/teacher/@cid/@mid/",
        },
        group: {
            url: API_URL + "group/teacher/@cid/",
            get: API_URL + "module/teacher/@cid/@gid/",
        },
        assignment: {
            url: API_URL + "assignment/teacher/@cid/",
            get: API_URL + "assignment/teacher/@cid/@aid/"
        },
        submission: {
            get: API_URL + "submission/teacher/@cid/@aid/@sid/",
            url: API_URL + "submission/teacher/@cid/@aid/"
        },
        grade: {
            url : API_URL + "grade/teacher/@cid/@aid/@sid/"
        }
    },
    student:{
        course:{
            get: API_URL + 'course/student/',
            put: API_URL + 'course/student/',
        },
        assignment: {
            url: API_URL + "assignment/student/@cid/",
            get: API_URL + "assignment/student/@cid/@aid/"
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