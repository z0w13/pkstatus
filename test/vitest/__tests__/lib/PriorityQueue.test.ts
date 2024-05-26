import PriorityQueue from 'src/lib/PriorityQueue';
import { describe, expect, it } from 'vitest';

describe('PriorityQueue', function () {
  describe('pop', function () {
    it('returns the first pushed item', function () {
      const queue = new PriorityQueue<string>();
      queue.push(1, 'first');
      queue.push(1, 'second');

      expect(queue.pop()).toBe('first');
    });
    it('returns the highest priority item', function () {
      const queue = new PriorityQueue<string>();

      queue.push(10, 'low');
      queue.push(1, 'high');

      expect(queue.pop()).toBe('high');
      expect(queue.pop()).toBe('low');
      expect(queue.pop()).toBeUndefined();
    });
    it('returns undefined when empty', function () {
      const queue = new PriorityQueue<string>();
      expect(queue.pop()).toBeUndefined();
    });
  });

  describe('peek', function () {
    it('returns the first pushed item', function () {
      const queue = new PriorityQueue<string>();

      queue.push(1, 'first');
      queue.push(1, 'second');

      expect(queue.pop()).toBe('first');
      expect(queue.pop()).toBe('second');
      expect(queue.pop()).toBeUndefined();
    });
  });

  describe('getHighestPriority() returns the highest priority', function () {
    const queue = new PriorityQueue<string>();

    queue.push(2, 'highest');
    queue.push(5, 'second');

    expect(queue.getHighestPriority()).toBe(2);
  });

  describe('length returns the length of the queue', function () {
    const queue = new PriorityQueue<string>();

    queue.push(1, 'first');
    queue.push(5, 'second');

    expect(queue.length).toBe(2);
  });

  describe('pushReplace', function () {
    it('replaces a prioritized item with a higher one', function () {
      const queue = new PriorityQueue<string>();

      queue.push(10, 'former-low');
      queue.push(2, 'high');
      queue.pushReplace(1, 'former-low');

      expect(queue.pop()).toBe('former-low');
      expect(queue.pop()).toBe('high');
      expect(queue.pop()).toBeUndefined();
    });
  });

  describe('wait', function () {
    describe("resolves instantly when there's an item in the queue", async function () {
      const queue = new PriorityQueue<string>();

      queue.push(1, 'item');

      await expect(queue.wait()).resolves.toBeUndefined();
    });

    describe('resolves when an item gets pushed', async function () {
      const queue = new PriorityQueue<string>();
      const prom = queue.wait();

      queue.push(1, 'first');

      await expect(prom).resolves.toBeUndefined();
    });
  });

  describe('waitPop resolves to the queue item', async function () {
    const queue = new PriorityQueue<string>();
    const prom = queue.waitPop();

    queue.push(1, 'first');

    await expect(prom).resolves.toBe('first');
  });
});
