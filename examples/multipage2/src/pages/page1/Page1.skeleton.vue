<template>
    <div class="skeleton-wrapper">
        <header class="skeleton-header"></header>
        <section class="skeleton-block">
            Skeleton of Page1
        </section>
    </div>
</template>

<script>

export default {
    name: 'skeleton'
};
</script>

<style scoped>

.skeleton-header {
    height: 52px;
    background: blue;
}

.skeleton-block {
    display: flex;
    flex-direction: column;
    padding-top: 8px;
}

</style>
