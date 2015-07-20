var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: '/addComment',
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>评论</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author} date={comment.date} userImg={comment.userImg}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="CommentList">
        {commentNodes}
      </div>
    );
  }
});
var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <div className="author">
          <img className="author_icon" src={this.props.userImg} />
          <span className="author_name">{this.props.author}</span>
          <span className="time">{this.props.date}</span>
        </div>
        <div className="comment_text">
        {this.props.children}
        </div>
      </div>
    );
  }
})
var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var date = new Date().toLocaleDateString();
    var text =  this.refs.text.getDOMNode().value.trim();
    var userImg = this.refs.userImg.getDOMNode().value.trim();
    if(!author || !text) {
      return;
    }
    this.props.onCommentSubmit({author: author,text: text,date: date,userImg: userImg});
    this.refs.text.getDOMNode().value = '';
    this.refs.author.getDOMNode().value = '';
    this.refs.userImg.getDOMNode().value = '';
    return;
  },
  render: function() {
    return (
      <div className="commentForm">
        <form className="form" onSubmit={this.handleSubmit}>
          <input tpye="text" placeholder="请输入你的名字" ref="author" className="user"/>
          <input tpye="text" placeholder="头像地址" ref="userImg" className="userImg"/>
          <textarea ref="text" className="text" placeholder="说点什么吧。。。。"></textarea>
          <input type="submit" value="评论" className="btn"/>
        </form>
      </div>
    );
  }
});
React.render(
  <CommentBox url="/getComments" pollInterval={2000}/>,
  document.getElementById('content')
);