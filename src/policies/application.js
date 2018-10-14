module.exports = class ApplicationPolicy {
  constructor(user, record) {
    this.user = user;
    this.record = record;
  }

  _isOwner() {
    return this.record.userId == this.user.id;
  }
  _isAdmin() {
    return this.user.role === 2;
  }

  _isPrivate() {
    return this.record.private;
  }
  _isCollaborator() {
    return (
      this.record.collaborators[0] &&
      this.record.collaborators.find(collaborator => {
        return collaborator.userId == this.user.id;
      })
    );
  }

  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  show() {
    if (this._isPrivate()) {
      if (
        this.new() &&
        (this._isOwner() || this._isCollaborator() || this._isAdmin())
      ) {
        return true;
      } else {
        console.log('isPrivate() wiki error');
        return false;
      }
    } else {
      return true;
    }
  }

  edit() {
    return this.new();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
};
