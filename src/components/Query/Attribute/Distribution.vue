<template>
  <div class="distribution">
    <div class="record">
      <div class="apply" @click="addNewConstraints"> add </div>
      <div class="apply" @click="renewConstraints"> renew </div>
    </div>
    <div class="header" v-for="(attr, ind) in attributes" 
      :key ="attr.attrName">
      <div class="name">{{attr.attrName}}</div>
      <div class="desc">{{attr.attrUnit}}</div>
      <div class="filter">
        <div class="bar-wrapper">
          <div class="bar-cont" :id = "ind">
            <div class="bar" v-for="(opt) in attr.options"
              :key="opt.left"
              :style="{
                left: prec(opt.left),
                width: prec(opt.width),
                height: prec(opt.height),
              }">
              <div class="shadow"
                :style="{
                  height: prec(opt.shadow)
                }"></div>
            </div>

            <div class="range left"
              :style="{
                left: prec(attr.leftX)
              }"
              @mousedown="mouseDidPressOnRanger($event, ind, 'left')"></div>
              
            <div class="range right"
              :style="{
                left: prec(attr.rightX )
              }"
              @mousedown="mouseDidPressOnRanger($event, ind, 'right')" ></div>
              
            <div class="range-axis left"
              :style="{
                width: prec(attr.options[0].left)
              }"></div>
            <div class="range-axis right"
              :style="{
                width: prec(attr.options[0].left + 3)
              }"></div>
          </div>
        </div>

        <div class="label">
          <div class="text minimum">
            {{attr.left}}
          </div>
          <div class="text maximum">
            {{attr.right}}
          </div>
        </div>
      </div>
      
    </div>

  </div>
</template>

<script>

import $ from 'jquery'

export default {
  name: 'Distribution',
  data:()=>({
    attributes: null,
    rangerFlag: false,    
  }),
  computed:{
    
  },
  methods:{
    prec(index) {
      return `${index}%`
    },

    addNewConstraints() {
      this.$store.commit('invalidConstraints')
      const inApply = true
      const attributes = []
      this.attributes.forEach(attr => {
        const attrName = attr.attrName
        const left = attr.left
        const right = attr.right
        const leftX = attr.leftX
        const rightX = attr.rightX
        attributes.push({attrName, left, right, leftX, rightX})
      })
      this.$store.commit('addConstraints', {inApply, attributes})
    },

    renewConstraints() {
      this.attributes.forEach(attr => {
        attr.left = attr.minValue
        attr.right = attr.maxValue
        attr.leftX = attr.options[0].left
        attr.rightX = attr.options[attr.options.length-1].left + attr.options[0].width
        attr.options.forEach(opt => {
          opt.shadow = 100
        })
      })
    },

    shadowHeight(index, type) {
      const attr = this.attributes[index]
      if(type == 'left')
      {
        attr.options.forEach(opt => {
          if(opt.rightRange <= attr.left)
          {
            opt.shadow = 0
          }
          else if(opt.leftRange < attr.left && opt.rightRange > attr.left)
          {
            const filt = attr.attrValue.filter(function(item) {
              const right = opt.rightRange <= attr.right ? opt.rightRange : attr.right
              return item.value >=attr.left && item.value < right
            })
            const origin = attr.attrValue.filter(function(item) {
              return item.value >=opt.leftRange && item.value <opt.rightRange
            })
            opt.shadow = filt.length / origin.length *100
          }
          else if(opt.leftRange >= attr.left &&opt.rightRange <= attr.right)
          {
            opt.shadow = 100
          }
          else if(opt.leftRange >= attr.left &&opt.rightRange > attr.right)
          {
            const filt = attr.attrValue.filter(function(item) {
              return item.value >=opt.leftRange && item.value < attr.right
            })
            const origin = attr.attrValue.filter(function(item) {
              return item.value >=opt.leftRange && item.value <opt.rightRange
            })
            opt.shadow = filt.length / origin.length *100
          }
        })
      }
      else if(type == 'right')
      {
        attr.options.forEach(opt => {
          if(opt.leftRange > attr.right)
          {
            opt.shadow = 0
          }
          else if(opt.leftRange <= attr.right && opt.rightRange > attr.right)
          {
            const filt = attr.attrValue.filter(function(item) {
              const left = opt.leftRange >= attr.left ? opt.leftRange : attr.left
              return item.value >= left && item.value < attr.right              
            })
            const origin = attr.attrValue.filter(function(item) {
              return item.value >=opt.leftRange && item.value <opt.rightRange
            })
            opt.shadow = filt.length / origin.length *100
          }
          else if(opt.rightRange <= attr.right && opt.leftRange >= attr.left)
          {
            opt.shadow = 100
          }
          else if(opt.rightRange <= attr.right && opt.leftRange < attr.left)
          {
            const filt = attr.attrValue.filter(function(item) {
              return item.value >=attr.left && item.value < opt.rightRange
            })
            const origin = attr.attrValue.filter(function(item) {
              return item.value >=opt.leftRange && item.value <opt.rightRange
            })
            opt.shadow = filt.length / origin.length *100
          }
        })
      }
    },

    mouseDidPressOnRanger (event, ind, type) {
      //this.rangerFlag = true
      const attr = this.attributes[ind]
      const width = $('.filter .bar-cont').width()
      //const left = $('.filter .bar-cont').offset().left
      const left = $('#' + ind).offset().left
      const moveFn = (e) => {
        const delta = (e.pageX - left) / width * 100
        const ratio = (attr.maxValue - attr.minValue)/(attr.options[attr.options.length-1].left + attr.options[0].width - attr.options[0].left)
        let newDown = delta * ratio 
        
        if(type == 'left')
        {
          newDown += attr.minValue
          if(newDown < attr.right && newDown > attr.minValue)
          {
            attr.left = Math.floor(newDown)
            attr.leftX = (e.pageX - left)/ width * 100
            //console.log('left: ' + attr.left)
          }
          else if(newDown >= attr.right)
          {
            attr.left = attr.right
            attr.leftX = attr.rightX
            //console.log('left: ' + attr.left)
          }
          else if(newDown <= attr.minValue)
          {
            attr.left = attr.minValue
            attr.leftX = attr.options[0].left
            //console.log('left: ' + attr.left)
          }
        }
        else if(type == 'right')
        {
          newDown += attr.minValue
          if(newDown > attr.left && newDown < attr.maxValue) 
          {
            attr.right = Math.floor(newDown)
            attr.rightX = (e.pageX - left) / width * 100
            //console.log('right: ' + attr.right)
          }
          else if(newDown >= attr.maxValue)
          {
            attr.right = attr.maxValue
            attr.rightX = attr.options[attr.options.length-1].left + attr.options[0].width
            //console.log('right: ' + attr.right)
          }
          else if (newDown <= attr.left)
          {
            attr.right = attr.left
            attr.rightX = attr.leftX
            //console.log('right: ' + attr.right)
          }          
        }
      }

      const commitFn = () => {
        //this.rangerFlag = false
        this.shadowHeight(ind, type)
        document.removeEventListener('mousemove', moveFn)
        document.removeEventListener('mouseup', commitFn)

      }

      document.addEventListener('mousemove', moveFn)
      document.addEventListener('mouseup', commitFn)


    },
  },
  created: function(){
    const year = this.$store.state.attribute.year
    const paper = this.$store.state.attribute.paper
    const coNumber = this.$store.state.attribute.coNumber
    const coWeight = this.$store.state.attribute.coWeight
    
    this.attributes = [year, paper, coNumber, coWeight]
  }
}
</script>

<style lang="scss"> 
@import '../../../styles/Constants.scss';

.distribution{
  flex: 0 0 $QUERY_ATTRIBUTE_DISTRIBUTION_HEIGHT;
  border-style: solid;
  border-width: 2px;
  border-color: $GRAY1;
  height: $QUERY_ATTRIBUTE_DISTRIBUTION_HEIGHT;
  //width: calc(100% - #{$QUERY_ATTRIBUTE_DISTRIBUTION_HEIGHT});
  width: 100%;
  //padding-left: $QUERY_ATTRIBUTE_DISTRIBUTION_HEIGHT;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  position: relative;
  overflow: hidden;
  overflow-x: auto;

  .record {
    flex: 0 0 $FILTER_FORCED_WIDTH;
    position: relative;
    border-style: solid;///
    border-width: 1px 1px 1px 0px;///
    border-color: $GRAY1;///
    width: $FILTER_FORCED_WIDTH;
    justify-content: center;
    align-items: center;
    display: flex;
    
    .apply {
      justify-content: center;
      align-items: center;
      display: flex;
      height: 24px;
      font-size: 14px;
      color: #777;
      padding: 0 10px;
      margin: 0 5px;
      background-color: $GRAY0;
      border: 1px solid $GRAY3;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 200ms, color 200ms;
      
      &:hover {
          background-color: $GRAY1;
        }
      
    }
  }

  .header {
    flex: 0 0 $FILTER_FORCED_WIDTH;
    border-style: solid;
    border-width: 2px 1px 1px 2px;
    border-color: $GRAY1;
    background-color: $GRAY2;
    width: $FILTER_FORCED_WIDTH;
    position: relative;
    overflow: hidden;

    .name {
      font-size: 15px;
      color: $GRAY5;
      margin-right: 30px;
      text-align: left;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      display: block;
      padding-left: 5px;
    }
    .desc {
      padding-top: 2px;
      font-size: 13px;
      color: $GRAY4;
      margin-right: 60px;
      text-align: left;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      display: block;
      padding-left: 6px;
    }

    .filter {
      position: absolute;
      height: 110px;
      left: 0px;
      right: 0px;
      top: 50px;
      
      .bar-wrapper {
        height: 90px;
        margin: 0 10px 10px 10px;
        border-bottom: 3px solid #FFB300;
        position: relative;
        padding: 1px 10px;
        box-sizing: border-box;
        
        .bar-cont {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .bar {
          position: absolute;
          width: 25%;
          bottom: 0;
          background-color: $GRAY1;
          overflow: hidden;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          //transition: background-color 200ms, height 200ms;

          .shadow {
            position: absolute;
            left: 0;
            width: 100%;
            bottom: 0;
            background-color: #FFB300;
            height: 100%;/////////
            // transition: background-color 200ms, height 200ms;

            &:hover {
              background-color: lighten(#FFB300, 10%);
            }
          }
        }

        .range {
          position: absolute;
          // box-sizing: content-box;
          top: calc(100% + 4px);
          transform: translate(-50%, 0);
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-bottom: 8px solid #FF7043;
          transition: border-bottom 200ms, left 200ms;
          cursor: pointer;
          width: 0;
          height: 0;


          &:hover, &.active {
            border-bottom: 8px solid lighten(#FF7043, 10%);
          }
        }

      }

      .range-axis {
        position: absolute;
        height: 3px;
        transform: translateY(1px);
        top: 100%;
        background-color: #FF7043;
        border-left: 10px solid #FF7043;
        transition: width 200ms;
        // border-bottom: 2px solid #607D8B;

        width: 10px;

        &.left {
          left: -10px;
        }

        &.right {
          right: -10px;
        }
      }

      .label {
        display: flex;
        padding: 0 17px;

        .text {
          flex: 1;
          font-size: 12px;
          color: $GRAY5;
          text-shadow: 0 0 1px $GRAY3;
          text-align: left;
          &.maximum {
            text-align: right;
          }
        }
      }

    }

  }
}
</style>
