  const removeFromCartForms = document.querySelectorAll(
      '[id^="removeFromCartForm-"]'
    );

    const cartIdElement = document.getElementById("cartId");
const cartId = cartIdElement ? cartIdElement.textContent : null;
    
    removeFromCartForms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const productId = form.getAttribute("id").split("-")[1];
        const prodTitle = form
          .closest(".max-w-4xl")
          .querySelector("h5").textContent;
    
        fetch(`/api/carts/${cartId}/product/${productId}`, {
          method: "DELETE",
        })
          .then(() => {
            Swal.fire({
              title: "Product removed from cart!",
              text: `You removed ${prodTitle} from the cart`,
              footer: "Reloading page in 4s",
              toast: true,
              position: "top-right",
              icon: "success",
              customClass: {
                popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
                confirmButton: "!bg-blue-600 !px-5",
                timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
              },
            });
            setTimeout(() => {
              location.reload();
            }, 4000);
          })
          .catch((error) => console.log(error));
      });
    });