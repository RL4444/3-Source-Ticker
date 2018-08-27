(function() {
    $.ajax({
        method: "GET",
        url: "/data.json",
        success: function(res) {
            var html = "";
            for (var i = 0; i < res.length; i++) {
                html +=
                    "<a href='" + res[i].href + "'>" + res[i].headline + "</a>";
            }
            $("#headlines").append(html);
            var headlines = $("#headlines");
            var links = headlines.children();
            var left = headlines.offset().left;
            var endId;
            function tick() {
                left--;

                if (left < -links.eq(0).outerWidth()) {
                    left += links.eq(0).outerWidth();
                    links.eq(0).appendTo(headlines);
                    links = $("a");
                }
                headlines.css({ left: left + "px" });
                endId = requestAnimationFrame(tick);
            }

            links
                .on("mouseenter", function() {
                    cancelAnimationFrame(endId);
                    links.css({
                        color: "blue",
                        textDecoration: "underline"
                    });
                })
                .on("mouseleave", function() {
                    requestAnimationFrame(tick);
                    links.css({
                        color: "black",
                        textDecoration: "none"
                    });
                });
            tick();
        }
    });
})();
