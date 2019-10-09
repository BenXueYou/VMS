function CDeque()
{
    this.m_count        = 0;
    this.m_array        = {};
    this.m_frontIndex   = 0;
};

/* 尾插 */
CDeque.prototype.push_back = function(e)
{
    this.m_array[this.m_count] = e;
    this.m_count++;
}

/* 头插 */
CDeque.prototype.push_front = function(e)
{
    if (this.empty()) //空队列
    {
        this.push_back(e);
    }
    else if (this.m_frontIndex > 0) //之前被删除，重新添加
    {
        this.m_frontIndex--;
        this.m_array[this.m_frontIndex] = e;
    }
    else // 正常头插 所有数据后移一位
    {
        for (let i = this.m_count; i > 0; i--)
        {
            this.m_array[i] = this.m_array[i - 1];
        }
        this.m_count++;
        this.m_array[0] = e;
    }
}

/* 弹出队尾元素 */
CDeque.prototype.pop_back = function()
{
    if (this.empty())
    {
        return undefined;
    }
    this.m_count--;
    const e = this.m_array[this.m_count];
    delete this.m_array[this.m_count];
    return e;
}

/* 弹出队首元素 */
CDeque.prototype.pop_front = function()
{
    if (this.empty())
    {
        return undefined;
    }
    const e = this.m_array[this.m_frontIndex];
    delete this.m_array[this.m_frontIndex];
    this.m_frontIndex++;
    return e;
}

/* 查看队尾元素 */
CDeque.prototype.back = function()
{
    if (this.empty())
    {
        return undefined;
    }
    return this.m_array[this.m_count - 1];
}

/* 查看队首元素 */
CDeque.prototype.front = function()
{
    if (this.empty())
    {
        return undefined;
    }
    return this.m_array[this.m_frontIndex];
}

/* size */
CDeque.prototype.size = function()
{
    return this.m_count - this.m_frontIndex;
}

/* 队列是否为空 */
CDeque.prototype.empty = function()
{
    return this.size() === 0;
}