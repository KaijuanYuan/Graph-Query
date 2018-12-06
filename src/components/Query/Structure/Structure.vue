<template>
  <div class="structure">
    <h1>{{ msg }}</h1>

  </div>
</template>

<script>
export default {
  name: 'Structure',
  data () {
    return {
      msg: 'Welcome to Helen\'s Structure Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"> 
@import '../../../styles/Constants.scss';

div.structure{
  flex: 1 1;
  border-style: solid;
  border-width: 1px;
  border-color: $GRAY1;
  width: 50%;
  min-height: $QUERY_ATTRIBUTE_DISTRIBUTION_HEIGHT;
}
</style>
