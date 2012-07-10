package a;

import b.b;
import b.e;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintStream;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.channels.FileChannel.MapMode;
import java.util.ArrayList;

public final class d
{
  private Integer a = Integer.valueOf(-1);
  private boolean b = false;
  private Integer c = Integer.valueOf(-1);
  private boolean d = false;
  private ArrayList e = new ArrayList();
  private ArrayList f = new ArrayList();
  private ArrayList g = new ArrayList();
  private ArrayList h = new ArrayList();
  private ArrayList i = new ArrayList();
  private ArrayList j = new ArrayList();
  private ArrayList k = new ArrayList();
  private StringBuffer l = new StringBuffer();
  private Integer[][] m = null;
  private StringBuffer n = new StringBuffer();

  public final void a()
  {
    try
    {
      BufferedReader localBufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(b.a.q)));
      long l1 = System.currentTimeMillis();
      a.a("get sex, phenotype and SNPs index");
      a(localBufferedReader);
      long l2 = System.currentTimeMillis();
      System.out.println("total time: " + (l2 - l1) / 1000L + " s");
      if (b.a.w)
      {
        a.a("get SNPs from .list file");
        l1 = System.currentTimeMillis();
        d locald = this;
        c localc;
        (localc = new c(locald.f, locald.e)).a();
        locald.e = localc.c();
        locald.f = localc.b();
        long l4 = Runtime.getRuntime().totalMemory();
        System.out.printf("Finished!Memory Usage: %d Mb, Total SNPs: %d\n", new Object[] { Long.valueOf(l4 / b.a.a), Integer.valueOf(locald.e.size()) });
        l3 = System.currentTimeMillis();
        System.out.println("total time: " + (l3 - l1) / 1000L + " s");
      }
      l1 = System.currentTimeMillis();
      a.a("save data into .arff file");
      b(localBufferedReader);
      long l3 = System.currentTimeMillis();
      System.out.println("total time: " + (l3 - l1) / 1000L + " s");
      localBufferedReader.close();
      a.b();
      return;
    }
    catch (IOException localIOException)
    {
      System.out.println("IOException in start from RawToArff.java");
      a.b();
      System.exit(b.a.c);
    }
  }

  private void a(BufferedReader paramBufferedReader)
  {
    try
    {
      Object localObject = null;
      String str;
      while ((str = paramBufferedReader.readLine()) != null)
      {
        if (localObject.trim().isEmpty())
          continue;
        int i2 = 0;
        int i3 = 0;
        int i4 = 0;
        int i5 = localObject.length();
        while (i3 < i5)
        {
          i4 += 10000;
          for (i3 = i4 < i5 ? i4 : i5 - 1; localObject.charAt(i3) != ' '; i3++)
          {
            if (i3 + 1 != i5)
              continue;
            i3 = i5;
            break;
          }
          b.d locald2 = new b.d(localObject.substring(i2, i3), paramBufferedReader);
          this.j.add(locald2);
          Thread localThread = new Thread(locald2);
          this.h.add(localThread);
          i2 = i3;
        }
        for (int i6 = 0; i6 < this.h.size(); i6++)
          ((Thread)this.h.get(i6)).start();
        System.out.printf("%d threads are created\n", new Object[] { Integer.valueOf(this.h.size()) });
        do
        {
          i6 = 1;
          for (int i7 = 0; i7 < this.h.size(); i7++)
          {
            if (((Thread)this.h.get(i7)).getState() == Thread.State.TERMINATED)
              continue;
            i6 = 0;
          }
        }
        while (i6 == 0);
        long l1 = Runtime.getRuntime().totalMemory();
        System.out.printf("Finished! Memory Usage: %d Mb, Total SNPs: %d\n", new Object[] { Long.valueOf(l1 / b.a.a), Integer.valueOf(this.e.size()) });
        int i1 = 0;
        for (i2 = 0; i2 < this.j.size(); i2++)
        {
          b.d locald1;
          if ((locald1 = (b.d)this.j.get(i2)).b())
            if (this.b)
            {
              System.out.println("More column with sex value in .raw file!");
              paramBufferedReader.close();
              System.exit(b.a.d);
            }
            else
            {
              this.b = true;
              this.a = locald1.a();
            }
          if (locald1.d())
            if (this.d)
            {
              System.out.println("More column with phenotype value in .raw file!");
              paramBufferedReader.close();
              System.exit(b.a.d);
            }
            else
            {
              this.d = true;
              this.c = locald1.c();
            }
          i4 = locald1.e().size();
          for (i5 = 0; i5 < i4; i5++)
          {
            this.e.add(Integer.valueOf(((Integer)locald1.e().get(i5)).intValue() + i1));
            this.f.add((String)locald1.f().get(i5));
          }
          i1 += ((Integer)locald1.e().get(i4 - 1)).intValue() + 1;
        }
        System.out.println("size of snp index:" + this.e.size());
        System.out.println("size of snp name" + this.f.size());
        break;
      }
    }
    catch (IOException localIOException)
    {
      System.out.println("IOException in getSexPhenotypeSNPindex from RawToArff.java");
      a.b();
      System.exit(b.a.d);
    }
    if (!this.b)
    {
      System.out.println("No sex column found in .raw file!");
      a.b();
      System.exit(b.a.d);
      return;
    }
    if (!this.d)
    {
      System.out.println("No phenotype column found in .raw file!");
      a.b();
      System.exit(b.a.d);
      return;
    }
    if (this.e.size() == 0)
    {
      System.out.println("No snp column found in .raw file!");
      a.b();
      System.exit(b.a.d);
    }
  }

  private void b(BufferedReader paramBufferedReader)
  {
    System.out.println("start save arff file");
    long l1 = Runtime.getRuntime().totalMemory();
    System.out.println("Total Memory: " + l1 / b.a.a + " Mb");
    try
    {
      b.a.v = b.a.u + ".temp";
      BufferedWriter localBufferedWriter = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(b.a.v)));
      int i3 = this.e.size();
      this.m = new Integer[i3 + 2][3];
      for (int i1 = 0; i1 < i3 + 2; i1++)
        for (i2 = 0; i2 < 3; i2++)
          this.m[i1][i2] = Integer.valueOf(2147483647);
      System.out.println("save instances and store value for header");
      long l2 = Runtime.getRuntime().totalMemory();
      System.out.println("Total Memory: " + l2 / b.a.a + " Mb");
      Object localObject = null;
      int i2 = 1;
      while ((localObject = paramBufferedReader.readLine()) != null)
      {
        if (((String)localObject).trim().isEmpty())
          continue;
        localObject = new e((String)localObject, i3, 0, this.a.intValue(), this.c.intValue(), i2 - 1, this.m, this.g, this.e);
        this.k.add(localObject);
        localObject = new Thread((Runnable)localObject);
        this.i.add(localObject);
        i2++;
        if ((i2 % 10 != 0) || (i2 == 0))
          continue;
        a(localBufferedWriter);
      }
      a(localBufferedWriter);
      localBufferedWriter.write(this.l.toString());
      localBufferedWriter.close();
      b();
      return;
    }
    catch (IOException localIOException)
    {
      System.out.println("IOException in saveArffFile from RawToArff.java");
      a.b();
      System.exit(b.a.f);
    }
  }

  private void a(BufferedWriter paramBufferedWriter)
  {
    for (int i1 = 0; i1 < this.i.size(); i1++)
      ((Thread)this.i.get(i1)).start();
    do
    {
      i1 = 1;
      for (int i2 = 0; i2 < this.i.size(); i2++)
      {
        if (((Thread)this.i.get(i2)).getState() == Thread.State.TERMINATED)
          continue;
        i1 = 0;
      }
    }
    while (i1 == 0);
    for (i1 = 0; i1 < this.k.size(); i1++)
    {
      this.l.append(((e)this.k.get(i1)).a());
      if (this.l.length() <= 500000)
        continue;
      paramBufferedWriter.write(this.l.toString());
      this.l = new StringBuffer();
    }
    this.i.clear();
    this.k.clear();
  }

  private void b()
  {
    System.out.println("write headers");
    long l1 = Runtime.getRuntime().totalMemory();
    System.out.println("Total Memory: " + l1 / b.a.a + " Mb");
    this.n.append(b.a.k);
    this.n.append(b.a.z);
    this.n.append("\n\n");
    int i1 = this.e.size();
    int i2;
    if (!b.a.D)
      for (i2 = 0; i2 < i1; i2++)
        a((String)this.f.get(i2), i2);
    else
      for (i2 = 0; i2 < i1; i2++)
        if (!b.a().contains(Integer.valueOf(i2)))
        {
          this.n.append(b.a.h);
          this.n.append((String)this.f.get(i2));
          this.n.append(" { 0, 1, 2 }\n");
        }
        else
        {
          a((String)this.f.get(i2), i2);
        }
    a("SEX", i1);
    a("PHENOTYPE", i1 + 1);
    this.n.append("\n@data\n");
    long l2 = Runtime.getRuntime().totalMemory();
    System.out.println("Total Memory: " + l2 / b.a.a + " Mb");
    try
    {
      FileChannel localFileChannel1 = new FileInputStream(b.a.v).getChannel();
      FileChannel localFileChannel2 = new RandomAccessFile(b.a.u, "rw").getChannel();
      long l3 = 0L;
      double d1 = localFileChannel1.size() / b.a.a;
      System.out.printf("file size: %.2f MB\n", new Object[] { Double.valueOf(d1) });
      System.out.printf("total block count: %d\n*****************\n", new Object[] { Integer.valueOf((int)(localFileChannel1.size() / b.a.B) + 1) });
      int i3 = 0;
      if (localFileChannel1.size() / b.a.a > 30L)
        while ((l3 < localFileChannel1.size()) && (localFileChannel1.size() - l3 > b.a.B))
        {
          a(i3, localFileChannel1, localFileChannel2, l3, b.a.B);
          i3++;
          l3 += b.a.B;
        }
      a(i3, localFileChannel1, localFileChannel2, l3, localFileChannel1.size() - l3);
      localFileChannel1.close();
      localFileChannel2.close();
      return;
    }
    catch (FileNotFoundException localFileNotFoundException)
    {
      System.out.println("FileNotFoundException in writeHeaders from RawToArff.java");
      return;
    }
    catch (IOException localIOException)
    {
      System.out.println("IOException in writeHeaders from RawToArff.java");
    }
  }

  private void a(String paramString, int paramInt)
  {
    this.n.append(b.a.h);
    this.n.append(paramString);
    this.n.append(b.a.i);
    if (!b.a().contains(Integer.valueOf(paramInt)))
      while (true)
      {
        Integer localInteger2 = this.m[paramInt][2];
        Integer localInteger1 = this.m[paramInt][1];
        paramString = paramString.intValue();
        String str = (localInteger1.intValue() < localInteger2.intValue() ? localInteger1 : localInteger2).intValue();
        if ((paramString = paramString = paramString < str ? paramString : str) == 2147483647)
          break;
        if (paramString != -2147483648)
        {
          this.n.append(paramString);
          this.n.append(',');
        }
        for (int i1 = 0; i1 < 3; i1++)
        {
          if (this.m[paramInt][i1].intValue() != paramString)
            continue;
          this.m[paramInt][i1] = Integer.valueOf(2147483647);
        }
      }
    paramString = b.a();
    ArrayList localArrayList = b.b();
    int i2 = paramString.size();
    for (int i3 = 0; i3 < i2; i3++)
    {
      if (!((Integer)paramString.get(i3)).equals(Integer.valueOf(paramInt)))
        continue;
      this.n.append((String)localArrayList.get(i3));
      this.n.append(',');
    }
    this.n.deleteCharAt(this.n.length() - 1);
    this.n.append(b.a.j);
  }

  private void a(int paramInt, FileChannel paramFileChannel1, FileChannel paramFileChannel2, long paramLong1, long paramLong2)
  {
    try
    {
      System.out.printf("start processing block No.%d\n", new Object[] { Integer.valueOf(paramInt) });
      if ((b.a.b = Runtime.getRuntime().freeMemory()) / b.a.a < 5L)
      {
        System.out.println("Memory is not enough. Only left: " + b.a.b);
        return;
      }
      paramFileChannel1 = paramFileChannel1.map(FileChannel.MapMode.READ_ONLY, paramLong1, paramLong2);
      if (paramInt == 0)
      {
        paramInt = this.n.length();
        paramFileChannel1 = b.a.a(paramFileChannel1);
        this.n.append(paramFileChannel1);
        paramFileChannel1 = b.a.a(this.n.toString());
      }
      else
      {
        paramInt = 0;
      }
      (paramInt = paramFileChannel2.map(FileChannel.MapMode.READ_WRITE, paramLong1, paramLong2 + paramInt)).put(paramFileChannel1);
      paramFileChannel1.clear();
      paramInt.clear();
      return;
    }
    catch (IOException localIOException)
    {
      System.out.println("IOException in processAndWriteData from RawToArff.java");
    }
  }
}

/* Location:           C:\Downloads\Project\MyEclipse\pipeline.jar
 * Qualified Name:     a.d
 * JD-Core Version:    0.6.0
 */