<template>
  <div class="range">
    <h1> Range~</h1>

  </div>
</template>

<script>
export default {
  name: 'Range'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"> 
@import '../../../styles/Constants.scss';

div.range{
    flex: 1 1;
    border-style: solid;
    border-width: 2px;
    border-color: $GRAY1;
    width: 100%;
    height: calc(100% - #{$QUERY_ATTRIBUTE_DISTRIBUTION_HEIGHT});
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}
</style>
