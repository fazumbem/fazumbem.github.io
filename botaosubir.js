jQuery(document).ready(function() {
            jQuery(window).scroll(function() {
                if (jQuery(this).scrollTop() > 300) {
                    jQuery('.botaofixo').fadeIn(200);
                } else {
                    jQuery('.botaofixo').fadeOut(200);
                }
            });
            
            jQuery('.botaofixo').click(function(event) {
                event.preventDefault();
                jQuery('html, body').animate({scrollTop: 0}, 300);
            })
        });