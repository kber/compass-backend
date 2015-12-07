'use strict';
const bookshelf = require('bookshelf');
const knex = require('knex');
const config = require('config');
const _ = require('lodash');
const utils = require('../lib/utils');
const schema = require('../data/schema');
let compassBookshelf;

compassBookshelf = bookshelf(knex(config.database));
compassBookshelf.plugin('registry');
compassBookshelf.Model = compassBookshelf.Model.extend({
  hasTimestamps: ['createdAt', 'updatedAt'],

  initialize() {
    this.on('creating', this.creating, this);
    this.on('saving', this.saving, this);
  },

  format(attrs) {
    return utils.underscored(attrs);
  },

  parse(attrs) {
    return utils.camelize(attrs);
  },

  creating(newObj, attr, context) {
    this.attributes = this.pick(this.permittedAttributes());
    this._updatedAttributes = newObj.previousAttributes();
    let contextUser = this.contextUser(context);

    if (_(this.permittedAttributes()).contains('createdBy') && !this.get('createdBy') && !!contextUser) {
      this.set('createdBy', contextUser);
    }

    if (_(this.permittedAttributes()).contains('updatedBy') && !this.get('updatedBy') && !!contextUser) {
      this.set('updatedBy', contextUser);
    }
  },

  saving(newObj, attr, context) {
    this.attributes = this.pick(this.permittedAttributes());
    this._updatedAttributes = newObj.previousAttributes();

    let contextUser = this.contextUser(context);
    if (_(this.permittedAttributes()).contains('updatedBy') && !!contextUser) {
      this.set('updatedBy', contextUser);
    }
  },

  contextUser(context) {
    if (context && context.user) {
      return context.user;
    } else {
      return;
    }
  },

  permittedAttributes() {
    let dbSchema = schema.tables[this.tableName];
    dbSchema = dbSchema.concat(['created_by', 'updated_by', 'created_at', 'updated_at']);

    let camelizedAttrs = [];
    _.each(dbSchema, function(attr) {
      camelizedAttrs.push(_.camelCase(attr));
    });
    return dbSchema.concat(camelizedAttrs);
  },

  getId() {
    return this.get('id');
  }
}, {
  add: function* (data, options) {
    return yield this.forge(data).save(null, options);
  },

  addOrUpdate: function* (data, options) {
    return yield this.add(data, options);
  },

  update: function* (data, options) {
    return yield this.add(data, options);
  },

  findOne: function* (id, options) {
    return yield this.where('id', id).fetch(options);
  },

  findOneByProperty: function* (queryParams, options) {
    return yield this.where(queryParams).fetch(options);
  },

  findAll: function* (options) {
    return yield this.fetchAll(options);
  },

  findAllByProperty: function* (queryParams, options) {
    return yield this.where(queryParams).fetchAll(options);
  },

  destroy: function* (id, options) {
    return yield this.forge({id: id}).destroy(options);
  },

  save: function* (model, options) {
    return yield model.save(null, options);
  },

  saveAll: function* (models, options) {
    return yield models.invokeThen('save', null, options);
  }
});

module.exports = compassBookshelf;
