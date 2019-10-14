$(document).ready(function() {
    Loading.init();
    /* Select Filter Option */
    $(document).on("click", '#select-option', function(e) {
        $('#select-option .options').toggleClass('open');
    });

    $(document).on("click", "#select-option .options li", function(e) {
        var selection = $(this).text();
        var value = $(this).data('value');
        $('#select-option .selected-option span#filter-value').text(selection).removeClass('placeholder').data('option', value);
        console.log($('span#filter-value').data('option'))
        $("input[name=mode]").val(value);
    });
    /* End.Select Filter Option */

    // Click Search 
    $(document).on("click", '#btn-search', function(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append('mode', $("input[name=mode]").val());
        formData.append('file', $('input[type=file]')[0].files[0]); 
        $.ajax({
            contentType: false,
            processData: false,
            url: URLAPI,
            type: METHOD,
            data: formData,
            beforeSend: function() {
                clearImageResult();
                Loading.show();
            },
            success: function(result) {
                let obj = JSON.parse(result);
                showImageResult(obj.data);
            },
            complete: function() {
                Loading.hide();
                //clearInputImage();
                //clearSelectOption();
            },
            error: function(result) {
                alert(result.status);
            }
        });
    });
});
const URLAPI = 'http://127.0.0.1:8080/search';
const METHOD = 'POST';
/* Upload Image by Input File */
function readUrl(inputFile) {
    var elementPreviewImage = $(inputFile).parent().siblings('.preview');
    var previewImg = elementPreviewImage.children('.img');
    var previewName = elementPreviewImage.children('.name');
    var btnChange = $(inputFile).parent().siblings('label');

    if (inputFile.files && inputFile.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
            var imgData = e.target.result;
            var imgName = inputFile.files[0].name;
            previewImg.html('<img src="' + imgData + '" />').addClass('show');
            previewName.text(imgName);
            btnChange.text('Change').removeClass('upload-image').addClass('change-image');
            $(inputFile).siblings('.dragBox-text').addClass("d-none");
        }
        reader.readAsDataURL(inputFile.files[0]);
        $(inputFile).data("valid", 1);
    }
};
/* End. Upload Image by Input File */

// Clear Form Input
function clearInputImage() {
    var inputFile = $("div.uploadOuter").find("input[type='file']");
    var elementPreviewImage = $(inputFile).parent().siblings('.preview');
    var previewImg = elementPreviewImage.children('.img');
    var previewName = elementPreviewImage.children('.name');
    var btnChange = $(inputFile).parent().siblings('label');
    previewImg.html('').removeClass('show');
    previewName.text("");
    btnChange.text('Upload').addClass('upload-image').removeClass('change-image');
    $(inputFile).siblings('.dragBox-text').removeClass("d-none");
    $(inputFile).val("");
}

function clearSelectOption() {
    $('#filter-value').text('Select option').addClass('placeholder').data('option', 0);
    $("input[name=mode]").val('color');
}
function showImageResult(data) {
    $.each( data, function( i, val ) {
        let numCol = i%4;
        let html =  '<img src="'+ val +'" class="img-fluid">';
        $('#col_' + numCol).append(html);
    });
}
function clearImageResult() {
    $('.col-image').html('');
}
var Loading = (function Loading() {
    var style = '<style>.overlay{position:fixed;top:0;left:0;height:100%;width:100%;z-index:1000;background-color:rgba(0,0,0,0.5)}.windows8{position:relative;width:78px;height:78px;margin:20% auto}.windows8 .wBall{position:absolute;width:74px;height:74px;opacity:0;transform:rotate(225deg);-o-transform:rotate(225deg);-ms-transform:rotate(225deg);-webkit-transform:rotate(225deg);-moz-transform:rotate(225deg);animation:orbit 6.96s infinite;-o-animation:orbit 6.96s infinite;-ms-animation:orbit 6.96s infinite;-webkit-animation:orbit 6.96s infinite;-moz-animation:orbit 6.96s infinite}.windows8 .wBall .wInnerBall{position:absolute;width:10px;height:10px;background:#fff;left:0;top:0;border-radius:10px}.windows8 #wBall_1{animation-delay:1.52s;-o-animation-delay:1.52s;-ms-animation-delay:1.52s;-webkit-animation-delay:1.52s;-moz-animation-delay:1.52s}.windows8 #wBall_2{animation-delay:.3s;-o-animation-delay:.3s;-ms-animation-delay:.3s;-webkit-animation-delay:.3s;-moz-animation-delay:.3s}.windows8 #wBall_3{animation-delay:.61s;-o-animation-delay:.61s;-ms-animation-delay:.61s;-webkit-animation-delay:.61s;-moz-animation-delay:.61s}.windows8 #wBall_4{animation-delay:.91s;-o-animation-delay:.91s;-ms-animation-delay:.91s;-webkit-animation-delay:.91s;-moz-animation-delay:.91s}.windows8 #wBall_5{animation-delay:1.22s;-o-animation-delay:1.22s;-ms-animation-delay:1.22s;-webkit-animation-delay:1.22s;-moz-animation-delay:1.22s}@keyframes orbit{0%{opacity:1;z-index:99;transform:rotate(180deg);animation-timing-function:ease-out}7%{opacity:1;transform:rotate(300deg);animation-timing-function:linear;origin:0}30%{opacity:1;transform:rotate(410deg);animation-timing-function:ease-in-out;origin:7%}39%{opacity:1;transform:rotate(645deg);animation-timing-function:linear;origin:30%}70%{opacity:1;transform:rotate(770deg);animation-timing-function:ease-out;origin:39%}75%{opacity:1;transform:rotate(900deg);animation-timing-function:ease-out;origin:70%}100%,76%{opacity:0;transform:rotate(900deg)}}@-o-keyframes orbit{0%{opacity:1;z-index:99;-o-transform:rotate(180deg);-o-animation-timing-function:ease-out}7%{opacity:1;-o-transform:rotate(300deg);-o-animation-timing-function:linear;-o-origin:0}30%{opacity:1;-o-transform:rotate(410deg);-o-animation-timing-function:ease-in-out;-o-origin:7%}39%{opacity:1;-o-transform:rotate(645deg);-o-animation-timing-function:linear;-o-origin:30%}70%{opacity:1;-o-transform:rotate(770deg);-o-animation-timing-function:ease-out;-o-origin:39%}75%{opacity:1;-o-transform:rotate(900deg);-o-animation-timing-function:ease-out;-o-origin:70%}100%,76%{opacity:0;-o-transform:rotate(900deg)}}@-ms-keyframes orbit{39%,7%{-ms-animation-timing-function:linear}0%,70%,75%{opacity:1;-ms-animation-timing-function:ease-out}100%,75%,76%{-ms-transform:rotate(900deg)}0%{z-index:99;-ms-transform:rotate(180deg)}7%{opacity:1;-ms-transform:rotate(300deg);-ms-origin:0}30%{opacity:1;-ms-transform:rotate(410deg);-ms-animation-timing-function:ease-in-out;-ms-origin:7%}39%{opacity:1;-ms-transform:rotate(645deg);-ms-origin:30%}70%{-ms-transform:rotate(770deg);-ms-origin:39%}75%{-ms-origin:70%}100%,76%{opacity:0}}@-webkit-keyframes orbit{0%{opacity:1;z-index:99;-webkit-transform:rotate(180deg);-webkit-animation-timing-function:ease-out}7%{opacity:1;-webkit-transform:rotate(300deg);-webkit-animation-timing-function:linear;-webkit-origin:0}30%{opacity:1;-webkit-transform:rotate(410deg);-webkit-animation-timing-function:ease-in-out;-webkit-origin:7%}39%{opacity:1;-webkit-transform:rotate(645deg);-webkit-animation-timing-function:linear;-webkit-origin:30%}70%{opacity:1;-webkit-transform:rotate(770deg);-webkit-animation-timing-function:ease-out;-webkit-origin:39%}75%{opacity:1;-webkit-transform:rotate(900deg);-webkit-animation-timing-function:ease-out;-webkit-origin:70%}100%,76%{opacity:0;-webkit-transform:rotate(900deg)}}@-moz-keyframes orbit{0%{opacity:1;z-index:99;-moz-transform:rotate(180deg);-moz-animation-timing-function:ease-out}7%{opacity:1;-moz-transform:rotate(300deg);-moz-animation-timing-function:linear;-moz-origin:0}30%{opacity:1;-moz-transform:rotate(410deg);-moz-animation-timing-function:ease-in-out;-moz-origin:7%}39%{opacity:1;-moz-transform:rotate(645deg);-moz-animation-timing-function:linear;-moz-origin:30%}70%{opacity:1;-moz-transform:rotate(770deg);-moz-animation-timing-function:ease-out;-moz-origin:39%}75%{opacity:1;-moz-transform:rotate(900deg);-moz-animation-timing-function:ease-out;-moz-origin:70%}100%,76%{opacity:0;-moz-transform:rotate(900deg)}}</style>';
    var html = '<div id="loading-overlay" class="overlay hidden"><div class="windows8"><div class="wBall" id="wBall_1"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_2"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_3"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_4"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_5"><div class="wInnerBall"></div></div></div></div>';

    var init = function init() {
        $('body').append(style)
            .append(html);
    };

    var show = function show() {
        $('#loading-overlay').removeClass('hidden');
    };

    var hide = function hide() {
        $('#loading-overlay').addClass('hidden');
    };

    return {
        init: init,
        show: show,
        hide: hide,
    };
})();
