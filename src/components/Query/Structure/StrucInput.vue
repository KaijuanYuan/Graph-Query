<template>
  <div class="strucInput">
  </div>
</template>

<script>

export default {
  name: 'StrucInput',
  data:()=>({
       
  }),
  computed:{
    
  },
  methods:{

  },
  created: function(){
    
  }
}
</script>

<style lang="scss"> 
@import '../../../styles/Constants.scss';

.strucInput{
  flex: 0 0 calc(100% - #{$PATTERN_FORCED_WIDTH});
  border-style: solid;
  border-width: 1px;
  border-color: $GRAY1;
  height: 100%;
  width: calc(100% - #{$PATTERN_FORCED_WIDTH});
  //width: $PATTERN_FORCED_WIDTH;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  overflow: hidden;
 
}
</style>
