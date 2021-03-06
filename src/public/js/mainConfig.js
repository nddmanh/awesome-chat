/**
 * Created on 25/02/2018.
 */

const socket = io();

function niceScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function resizeNiceScrollLeft() {
  $('.left').getNiceScroll().resize();
}

function niceScrollRight(divId) {
  $(`.right .chat[data-chat = ${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat = ${divId}]`).scrollTop($(`.right .chat[data-chat = ${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function(editor, event) {
        // Gan gia tri vao the input da bi an
        $(`#write-chat-${divId}`).val(this.getText());
      },
      click: function () {
        // Bat lang nghe DOM cho viec chat tin nhan van ban
        textAndEmojiChat(divId);
        // Bat chuc nang nguoi dung dang go tro chuyen
        typingOn(divId);
      },
      blur: function() {
        // Tat chuc nang nguoi dung dang go tro chuyen
        typingOff(divId);
      }
    },
  });
  $('.icon-chat').bind('click', function(event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('.master-loader').css('display', 'none');
}

function spinLoading() {
  $('.master-loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function() {
      spinLoading();
    })
    .ajaxStop(function() {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function() {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function() {
    $('#notifications').fadeToggle('fast', 'linear');
    // $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(".main-content").click(function() {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images").unbind("click").on("click", function () {  
    let href = $(this).attr("href");
    let modalImagesId = href.replace("#", "");

    let originDataImage = $(`#${modalImagesId}`).find("div.modal-body").html();

    let countRows = Math.ceil($(`#${modalImagesId}`).find("div.all-images>img").length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");
    
    $(`#${modalImagesId}`).find("div.all-images").photosetGrid({
      highresLinks: true,
      rel: "withhearts-gallery",
      gutter: "2px",
      layout: layoutStr,
      onComplete: function() {
        $(`#${modalImagesId}`).find(".all-images").css({
          "visibility": "visible"
        });
        $(`#${modalImagesId}`).find(".all-images a").colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: "90%",
          maxWidth: "90%"
        });
      }
    });

    // Bat su kien dong modal
    $(`#${modalImagesId}`).on('hidden.bs.modal', function () {
      $(this).find("div.modal-body").html(originDataImage);
    })
  });
}

function flashMasterNotify() {
    let notify = $('.master-success-message').text();
    if (notify.length) {
      alertify.notify(notify, "success", 7);
    }
}

function changeTypeChat() {
  $("#select-type-chat").bind("change", function () {  
    let optionSelected = $("option:selected", this);
    optionSelected.tab("show");

    if ($(this).val() === "user-chat") {
      $(".create-group-chat").hide();
    } else {
      $(".create-group-chat").show();
    }
  });
}

function changeScreenChat() {  
  $(".room-chat").unbind("click").on("click", function () {
    let divId = $(this).find("li").data("chat");

    $(".person").removeClass("active");
    $(`.person[data-chat=${divId}]`).addClass("active");

    $(this).tab("show");

    // Cau hinh thanh cuon ben box chat rightSide.ejs moi khi click chuot vao cuoc tro chuyen cu the
    niceScrollRight(divId);

    // B???t emoji, tham s??? truy???n v??o l?? id c???a box nh???p n???i dung tin nh???n
    enableEmojioneArea(divId);

    // Bat lang nghe DOM cho viec chat tin nhan hinh anh
    imageChat(divId);

    // Bat lang nghe DOM cho viec chat tin nhan file
    attachmentChat(divId);

    // Bat lang nghe DOM cho viec call video
    videoChat(divId);
  })
}

function convertEmoji() {
  $(".convert-emoji").each(function () {
    var original = $(this).html();
    var converted = emojione.toImage(original);
    $(this).html(converted);
  });
}

function bufferToBase64(arrayBuffer) {
  return btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
}

function zoomImageChat() {
  $(".show-image-chat").unbind("click").on("click", function() {
    console.log("da click");
    $("#img-chat-modal").css("display", "block");
    $("#img-chat-modal-content").attr("src", $(this)[0].src);
    
    $("#img-chat-modal").on("click", function() {
      $(this).css("display", "none");
    });
  });
}

function userTalk() {
  $(".user-talk").unbind("click").on("click", function() {
    let dataChat = $(this).data("uid");
    $("ul.people").find(`a[href="#uid_${dataChat}"]`).click();
    $(this).closest("div.modal").modal("hide");
  })
}

function notYetConversations() {
  Swal.fire({
    title: "B???n ch??a c?? b???n b?? n??o. \n T??m ki???m li??n h??? m???i ngay!",
    type: "info",
    showCancelButton: false,
    confirmButtonColor: "#2ecc71",
    confirmButtonText: "X??c nh???n"
  }).then(result => {
    $("#contactsModal").modal("show");
  })
}

$(document).ready(function() {
  // Hide s??? th??ng b??o tr??n ?????u icon m??? modal contact
  showModalContacts();

  // B???t t???t popup notification
  configNotification();

  // C???u h??nh thanh cu???n b??n tr??i
  niceScrollLeft();

  // Icon loading khi ch???y ajax
  ajaxLoading();

  // Hi???n th??? h??nh ???nh grid slide trong modal t???t c??? ???nh, tham s??? truy???n v??o l?? s??? ???nh ???????c hi???n th??? tr??n 1 h??ng.
  // Tham s??? ch??? ???????c ph??p trong kho???ng t??? 1 ?????n 5
  gridPhotos(5);

  // Flash message o man hinh master
  flashMasterNotify();

  // Thay doi kieu tro chuyen
  changeTypeChat();

  // Thay doi man hinh chat
  changeScreenChat();

  // Convert cac unicode thanh bieu tuong cam xuc
  convertEmoji();
  
  // Click vao phan tu dau tien cua cuoc tro chuyen
  if ($("ul.people").find("a").length) {
    $("ul.people").find("a")[0].click();
  } else {
    notYetConversations();
  }

  // Extra
  zoomImageChat();
  userTalk();

  $("#video-chat-group").bind("click", function () {
    alertify.notify("T??nh n??ng n??y kh??ng kh??? d???ng v???i nh??m tr?? chuy???n.", "error", 7);
  });
});
