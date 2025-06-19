import Swal from "sweetalert2";

export const SwalSuccess = (title="Success!", message) => {
    Swal.fire({
        title,
        text: message,
        icon: "success",
    })
}

export const SwalError = (title="Error!", message) => {
    Swal.fire({
        title,
        text: message,
        icon: "error",
    })
}