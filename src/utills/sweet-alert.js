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

export const SwalConfirm = (title="Confirm", message) => {
    return Swal.fire({
        title,
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
    })
}