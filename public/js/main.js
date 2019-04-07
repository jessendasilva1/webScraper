// Get references to page elements
var $commentButton = $(".checkComments");
var $postButton = $("#postComment");

var handleButtonClick = function(event) {
  console.log("btn clicked");
  let dataID = event.target.id;
  console.log(dataID);
  $.ajax({
    url: "/comments",
    type: "POST",
    data: { id: dataID }
  }).then(() => {
    //console.log(message);
  });
};

var handlePostButtonClick = function(event) {
  let dataID = $("#" + event.target.id).data("itemid");
  console.log(dataID);
  let title = "Bob";
  let body = $("#commentBody").val();
  $.ajax({
    url: "/postComment",
    type: "POST",
    data: {
      id: dataID,
      title: title,
      commentBody: body
    }
  }).then(() => {
    $("#commentBody").val("");
    //console.log();
  });
  console.log("btn clicked");
};

$commentButton.on("click", handleButtonClick);
$postButton.on("click", handlePostButtonClick);
