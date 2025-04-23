import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class SweetAlertService {
  successAlert(message: string) {
    Swal.fire({
      title: "Success",
      text: message,
      icon: "success",
      confirmButtonText: "OK",
    });
  }

  alertOnParent(message: string) {
    Swal.fire({
      title: "Success",
      text: message,
      icon: "success",
      confirmButtonText: "OK",
      target: 'top'
    });
  }

  errorAlert(message: string) {
    Swal.fire({
      title: "Error",
      text: message,
      icon: "error",
      confirmButtonText: "OK",
    });
  }

  warningAlert(message: string) {
    Swal.fire({
      title: 'Warning',
      text: message,
      icon: 'warning',
      confirmButtonText: 'OK'
    });

    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      text: message,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

  infoAlert(message: string) {
    Swal.fire({
      //title: "Information",
      text: message,
      icon: "info",
      confirmButtonText: "OK",
    });
  }

  // alert(message: string, type: "info" | "success" | "error" | "warning") {
  //   // if (type == "info") {
  //   //   this.infoAlert(message);
  //   // }
  //   switch (type) {
  //     case "info":
  //       this.infoAlert(message);
  //       break;
  //     case "error":
  //       this.errorAlert(message);
  //       break;
  //     case "success":
  //       this.successAlert(message);
  //       break;
  //     case "warning":
  //       this.warningAlert(message);
  //       break;

  //     default:
  //       break;
  //   }
  // }
}
