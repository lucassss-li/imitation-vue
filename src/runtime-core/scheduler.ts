const queue: any[] = []
let isFlushPending = false
export function queueJobs(job) {
    if (!queue.includes(job)) {
        queue.push(job)
    }
    queueFlush()
}

function queueFlush() {
    if (isFlushPending) {
        return
    }
    isFlushPending = true
    Promise.resolve().then(() => {
        isFlushPending = false
        let job
        while ((job = queue.shift())) {
            job && job()
        }
    })
}

export function nextTick(fn) {
    return fn ? Promise.resolve().then(fn) : Promise.resolve()
}
