

var isPlayed = false;
// var cadr_count = 90;    //кол-во кадров
// var cadr_width = 334;   //ширина кадра

//Инициализация слайдера

$(function () {
    $("#slider").slider({
        range: "min",
        min: 0,     //нач. значение
        max: cadr_count - 1,    //макс. значение
        value: 0,

        //
        slide: function (event, ui) {

            if (isPlayed) {
                isPlayed = false;
                $("btn_play").val("Play");
                return;
            }

            slideImage("screen", ui.value);

        }
    });

    //для Play
    $("#myscr #btn_play").click(function () {
        isPlayed = !isPlayed;
        if (!isPlayed) {
            $("#btn_play").val("Play");
            return;
        }
        $("#btn_play").val("Pause");
        playImageSlider("screen", $("#slider").slider("value"));
    });
});


function slideImage(id_container, cadr_num) {
    var s = (1 - cadr_num) * cadr_width;    //смещение по X
    $("#" + id_container).css("background-position", s.toString() + "px top");
}

//прокрутка по кнопке Play
function playImageSlider(id_container, cadr_start) {
    var i = (cadr_start + 1) % cadr_count;
    (function () {
        if (isPlayed) {
            slideImage(id_container, i);
            $("#slider").slider("value", i);
            i = (i + 1) % cadr_count;
            setTimeout(arguments.callee, 25);
        } else {
            return;
        }
    })();
}
