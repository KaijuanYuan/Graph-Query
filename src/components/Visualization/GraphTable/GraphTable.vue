<template>
    <div class="graphtable">
        <svg></svg>
    </div>
</template>

<script>
export default {
    name: "GraphTable",
    data: () => ({}),
    computed: {},
    methods: {},
    mounted: function() {
        console.log('GraphTable Mounted', this.$store.state.attribute);
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
div.graphtable {
    flex: 1;
    svg {
        width: 100%;
        height: 100%;
    }
}
</style>
